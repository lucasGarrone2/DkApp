/**
 * Adds a random delay between minMs and maxMs to mimic human behavior
 */
export async function randomDelay(minMs = 2000, maxMs = 5000): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1) + minMs);
  return new Promise((resolve) => setTimeout(resolve, delay));
}
