# Stage de build
FROM node:18-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Copia package-lock y package para aprovechar cache de dependencias
COPY package.json package-lock.json next.config.mjs ./

# Instala dependencias (incluye dev para build)
RUN npm ci

# Copia el resto del código y construye
COPY . .
RUN npm run build

# Stage de producción
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
ENV NEXT_TELEMETRY_DISABLED=1

# Copia package para instalar solo deps de producción
COPY package.json package-lock.json ./

# Instala solo dependencias de producción
RUN npm ci --omit=dev

# Copia artefactos de build y archivos estáticos
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 4000

# Ejecuta next en producción en el puerto 4000
CMD ["npm", "run", "start", "--", "-p", "4000"]
