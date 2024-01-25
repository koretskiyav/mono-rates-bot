FROM node:20-alpine as dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
COPY --from=dev /app/node_modules ./node_modules
COPY . .
RUN npm run build
ENV NODE_ENV prod
RUN npm ci --only=production && npm cache clean --force

FROM node:20-alpine as prod
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
CMD [ "node", "dist/main.js" ]
