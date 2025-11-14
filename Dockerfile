# 1. Base image
FROM node:18-alpine AS builder

WORKDIR /app

# 2. Install dependencies
COPY package*.json ./
RUN npm install

# 3. Build Next.js app
COPY . .
RUN npm run build

# 4. Production image
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
