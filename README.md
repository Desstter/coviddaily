# COVID Daily — Tracker de Estadísticas COVID-19

Dashboard en tiempo real para visualizar estadísticas diarias del COVID-19 por país. Consume datos de una API pública y los presenta en gráficos interactivos y tablas.

## Stack

**Frontend:** Vue.js 3 · JavaScript

**Backend:** Node.js · Express

## Features

- Consulta de casos, muertes y recuperados por país
- Actualización en tiempo real con los últimos datos disponibles
- Visualización con gráficos interactivos
- Búsqueda y comparación entre países

## Setup

```bash
# Instalar dependencias (cliente y servidor)
npm install

# Iniciar servidor
cd server
npx nodemon

# Iniciar cliente (en otra terminal)
cd client
npm run serve
```

El cliente corre en `http://localhost:8080` y el servidor en `http://localhost:3000`.
