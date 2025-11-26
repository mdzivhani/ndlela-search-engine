FROM node:20-alpine AS build
WORKDIR /app
# Note: Using npm install instead of npm ci because package-lock.json is not committed
# For reproducible builds, consider committing package-lock.json and using npm ci
COPY package.json ./
RUN npm install --production
COPY . .

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app .
EXPOSE 3001
CMD [ "node", "index.js" ]
