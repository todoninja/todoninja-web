# build environment
FROM node:16-alpine as build
RUN mkdir /app
COPY ./ /app
WORKDIR /app
RUN npm ci
RUN ls
RUN npm run build

# production environment
FROM nginx:1.21-alpine as production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
