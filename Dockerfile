FROM node:6

WORKDIR /usr/src/app
COPY . .

RUN yarn install
RUN yarn build

FROM nginx:latest

COPY --from=0 /usr/src/app/dist /usr/share/nginx/html/dist
COPY --from=0 /usr/src/app/index.html /usr/share/nginx/html/
EXPOSE 80
