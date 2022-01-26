# build environment
FROM node:16-alpine as build
RUN mkdir /app
COPY code /app/code
WORKDIR /app/code
RUN npm ci
RUN ls
RUN npm run build

# production environment
FROM nginx:1.21-alpine as production
COPY --from=build /app/code/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
