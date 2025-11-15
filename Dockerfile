# 1. Base image
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./

# Install all dependencies to build the app
RUN npm install

COPY . .
RUN npm run build

# ---

# 2. Production image
FROM node:18-alpine
WORKDIR /app

# Copy only the files needed for production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Copy next.config.js if you have one
# COPY --from=builder /app/next.config.js ./

# Install *only* production dependencies
RUN npm ci --only=production

ENV PORT=3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]