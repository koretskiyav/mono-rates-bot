FROM node:20-alpine

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]

FROM node:20-alpine as dev
RUN apk --update add postgresql-client

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine as prod
RUN apk --update add postgresql-client

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

COPY --from=dev /app/dist ./dist

CMD ["node", "dist/main"]