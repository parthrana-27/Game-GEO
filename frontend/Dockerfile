# Frontend Dockerfile — multi-stage Nginx build

# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

# VITE_ env vars must be declared as ARGs to be accessible at build time
ARG VITE_API_URL=/api
ARG VITE_STREET_VIEW_API_KEY=
ARG VITE_MAPILLARY_ACCESS_TOKEN=
ARG VITE_STREET_VIEW_PROVIDER=google
ARG VITE_OSM_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_STREET_VIEW_API_KEY=$VITE_STREET_VIEW_API_KEY
ENV VITE_MAPILLARY_ACCESS_TOKEN=$VITE_MAPILLARY_ACCESS_TOKEN
ENV VITE_STREET_VIEW_PROVIDER=$VITE_STREET_VIEW_PROVIDER
ENV VITE_OSM_TILE_URL=$VITE_OSM_TILE_URL

COPY . .
RUN npm run build

# ── Stage 2: Serve with Nginx ─────────────────────────────────────────────────
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
