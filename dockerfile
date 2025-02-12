# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --production
RUN npm cache clean --force
RUN rm -rf /root/.npm
RUN rm -rf node_modules

COPY . .

RUN npm run build

FROM node:22-alpine

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --from=builder  /app/node_modules ./node_modules
COPY --from=builder  /app/package*.json ./
COPY --from=builder  /app/build ./build

EXPOSE $PORT

CMD ["node", "build/src/presentation/express/server.js"]
