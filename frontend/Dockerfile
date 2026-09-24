FROM node:22-alpine AS build

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Inlined into the client bundle at build time
ARG NEXT_PUBLIC_API_URL=http://localhost:5000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build && rm -rf .next/cache


FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY next.config.mjs ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next

USER node
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
