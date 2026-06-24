# Backend Dockerfile
# Multi-stage build: compile TypeScript → run compiled JS

FROM node:20-slim AS builder

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate
RUN npm run build

# ── Production image ─────────────────────────────────────────────────────────
FROM node:20-slim AS runner

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

EXPOSE 3001
CMD ["node", "dist/server.js"]
