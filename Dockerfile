# Stage 1: build
FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# ---
# Stage 2: production deps (fresh install, no devDependencies)
FROM node:24-alpine AS deps

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# ---
# Stage 3: minimal runtime image
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/build ./build
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "build/index.js"]
