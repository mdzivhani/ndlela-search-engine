FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app .
EXPOSE 3001
CMD [ "node", "index.js" ]
