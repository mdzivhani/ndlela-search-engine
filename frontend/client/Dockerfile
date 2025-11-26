FROM node:20-alpine AS build
WORKDIR /app
# Note: Using npm install instead of npm ci because package-lock.json is not committed
# For reproducible builds, consider committing package-lock.json and using npm ci
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
