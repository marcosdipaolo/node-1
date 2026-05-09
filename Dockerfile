FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm@11.0.9

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm --version

RUN pnpm install --frozen-lockfile

EXPOSE 3000

CMD ["pnpm", "dev"]