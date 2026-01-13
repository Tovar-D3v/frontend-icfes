# Stage de build
FROM node:18-alpine AS builder
WORKDIR /app

# Copia lockfile y package para aprovechar cache de dependencias
COPY package.json package-lock.json next.config.mjs ./

# Copia el resto del código
COPY . .

# Instala dependencias de build y construye la app
RUN npm ci
RUN npm run build

# Stage de producción
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

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
