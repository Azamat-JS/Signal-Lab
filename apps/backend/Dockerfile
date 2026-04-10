FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY apps/backend/package.json ./
COPY apps/backend/pnpm-lock.yaml ./
COPY prisma ./prisma

RUN corepack enable
RUN corepack prepare pnpm@latest --activate
RUN pnpm install

COPY apps/backend .

EXPOSE 3001

CMD ["pnpm", "run", "start:dev"]