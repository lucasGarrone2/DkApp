import https from 'https';
import http from 'http';

interface RobotsRule {
  userAgent: string;
  disallow: string[];
  allow: string[];
  crawlDelay?: number;
}

const robotsCache = new Map<string, RobotsRule[]>();

async function fetchRobotsTxt(baseUrl: string): Promise<string> {
  const robotsUrl = new URL('/robots.txt', baseUrl).href;
  return new Promise((resolve) => {
    const client = robotsUrl.startsWith('https') ? https : http;
    client.get(robotsUrl, { timeout: 10000 }, (res) => {
      if (res.statusCode !== 200) {
        resolve(''); // No robots.txt = everything allowed
        return;
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    }).on('error', () => resolve('')); // On error, assume allowed
  });
}

function parseRobotsTxt(content: string): RobotsRule[] {
  const rules: RobotsRule[] = [];
  let currentRule: RobotsRule | null = null;

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.substring(0, colonIdx).trim().toLowerCase();
    const value = line.substring(colonIdx + 1).trim();

    if (key === 'user-agent') {
      currentRule = { userAgent: value.toLowerCase(), disallow: [], allow: [] };
      rules.push(currentRule);
    } else if (currentRule) {
      if (key === 'disallow' && value) {
        currentRule.disallow.push(value);
      } else if (key === 'allow' && value) {
        currentRule.allow.push(value);
      } else if (key === 'crawl-delay') {
        currentRule.crawlDelay = parseInt(value, 10);
      }
    }
  }

  return rules;
}

function isPathAllowed(rules: RobotsRule[], path: string, botName: string): boolean {
  const specificRule = rules.find((r) => r.userAgent === botName.toLowerCase());
  const wildcardRule = rules.find((r) => r.userAgent === '*');
  const rule = specificRule || wildcardRule;

  if (!rule) return true;

  for (const allowPath of rule.allow) {
    if (path.startsWith(allowPath)) return true;
  }

  for (const disallowPath of rule.disallow) {
    if (disallowPath === '/' || path.startsWith(disallowPath)) return false;
  }

  return true;
}

export function getCrawlDelay(rules: RobotsRule[], botName: string): number | undefined {
  const specificRule = rules.find((r) => r.userAgent === botName.toLowerCase());
  const wildcardRule = rules.find((r) => r.userAgent === '*');
  return (specificRule || wildcardRule)?.crawlDelay;
}

export async function checkRobotsPermission(
  url: string,
  botName: string = 'dkapp-bot'
): Promise<{ allowed: boolean; crawlDelay?: number }> {
  try {
    const parsedUrl = new URL(url);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
    const path = parsedUrl.pathname;

    let rules = robotsCache.get(baseUrl);
    if (!rules) {
      const content = await fetchRobotsTxt(baseUrl);
      rules = parseRobotsTxt(content);
      robotsCache.set(baseUrl, rules);
    }

    const allowed = isPathAllowed(rules, path, botName);
    const crawlDelay = getCrawlDelay(rules, botName);

    return { allowed, crawlDelay };
  } catch (error) {
    console.warn(`⚠️ Could not check robots.txt for ${url}: ${(error as Error).message}`);
    return { allowed: true };
  }
}
