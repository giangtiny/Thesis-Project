# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:16.19-alpine AS builder

WORKDIR /app

RUN mkdir -p /opt/node_modules

COPY ./package.json /app/

COPY yarn.lock /app/

RUN yarn install

COPY . .

EXPOSE 5173

