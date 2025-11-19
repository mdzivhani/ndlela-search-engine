FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --silent
COPY . .
RUN npm run build || true

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app .
EXPOSE 3001
CMD [ "node", "index.js" ]
