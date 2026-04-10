FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY apps/backend/package.json ./
COPY apps/backend/pnpm-lock.yaml ./
COPY prisma ./prisma

RUN pnpm install

RUN pnpm prisma generate

COPY apps/backend .

EXPOSE 3001

CMD ["pnpm", "run", "start:dev"]