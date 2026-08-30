FROM node:20-alpine

# Prisma's query engine needs OpenSSL, which isn't in the base alpine image.
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate

COPY src ./src

EXPOSE 4000

# Apply pending migrations against whatever DATABASE_URL points to, then start.
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
