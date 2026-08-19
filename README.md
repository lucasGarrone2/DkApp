# 🇩🇰 DK Rentals — Copenhagen Housing Aggregator & Group Match

**DK Rentals** es una plataforma centralizada y agregador inteligente de alojamientos en Copenhague, diseñada específicamente para facilitar la búsqueda de vivienda a grupos y personas en visa **Working Holiday** o expatriados en Dinamarca.

---

## 🎯 El Problema que Resuelve

Conseguir alquiler en Copenhague es uno de los mayores desafíos al emigrar debido a:
1. **Mercado fragmentado:** Las ofertas están repartidas entre múltiples inmobiliarias y portales (*HousingAnywhere, EDC, Kvikbolig, DBA*).
2. **Requisitos de CPR (Bopælsregistrering):** Muchas publicaciones no permiten registrar el CPR o no cuentan con el metraje/habitaciones legales para registrar a 3 o más personas.
3. **Costos iniciales elevados (Move-in costs):** En Dinamarca es estándar pagar alquiler + hasta 3 meses de depósito + hasta 3 meses de alquiler por adelantado (*forudbetalt leje*).
4. **Falta de herramientas colaborativas:** Coordinar postulaciones, notas y visitas entre amigos o parejas suele ser desordenado.

---

## ✨ Funcionalidades Principales

### 🤖 1. Agregador Multi-Portal Automatizado
- Rastreo periódico y consolidación de alquileres en tiempo real desde los principales portales inmobiliarios de Dinamarca.
- **Filtro Anti-Marketplace:** Algoritmo estricto de validación que descarta publicaciones no habitacionales (repuestos, muebles, bicicletas, etc.), asegurando un catálogo 100% de departamentos y habitaciones reales.

### 🪪 2. Filtro Especializado "Apto 3 CPR"
- Detección automática y filtro exclusivo para propiedades que permiten el registro legal de **3 CPRs** según las regulaciones municipales danesas (evaluando metraje $\ge 50\text{ m}^2$ y distribución $\ge 2-3$ habitaciones).

### 🎯 3. Algoritmo de Match y Recomendación (0–100%)
- Cada propiedad es evaluada automáticamente por un sistema de puntuación que analiza:
  - **Permiso de CPR:** Bonificación crítica si permite registro; penalización si no lo permite.
  - **Duración del contrato:** Prioridad a contratos ilimitados (*ubegrænset*) o de media/larga estancia ($\ge 3$ meses).
  - **Tope presupuestario:** Penalización automática si el costo supera los **8.000 DKK / persona** (evitando publicaciones sobrevaluadas).
  - **Conectividad urbana:** Evaluación de cercanía a zonas clave y tiempo en bicicleta a la Estación Central (*København H*).

### 👥 4. Finanzas Claras y División de Gastos en Grupo
- **Selector de Grupo Dinámico:** Permite alternar entre 1, 2, 3 o 4 personas.
- **Cálculo por Persona:** Desglose automático de cuánto paga cada integrante por mes y cuánto debe aportar para el costo de entrada (*Move-in Cost*).
- **Conversión Dual DKK / USD:** Visualización simultánea en coronas danesas y dólares estadounidenses aproximados.

### 💬 5. Herramientas de Colaboración Grupal
- **Bitácora y Estados:** Marcado de favoritos, interesados, aplicados y descartados, con guardado de notas compartidas sobre quién contactó al arrendador.
- **WhatsApp Share en 1 Click:** Generador de fichas resumidas y formateadas para enviar directamente al grupo de WhatsApp.
- **Plantilla de Postulación Rápida:** Botón para copiar una carta de presentación formal en danés e inglés lista para postular.
- **Comparador Side-by-Side:** Vista paralela para contrastar múltiples departamentos seleccionados.

---

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, TypeScript.
- **Base de Datos:** Supabase (PostgreSQL con políticas RLS y filtros full-text).
- **Scraper & Automatización:** Node.js, TypeScript, Puppeteer con modo Stealth.
- **CI/CD & Cloud Cron:** GitHub Actions (ejecución horaria del scraper) y Vercel (despliegue del frontend).
