FROM node:18-alpine AS build
WORKDIR /app
COPY ../package.json ../package-lock.json ./
RUN npm ci
COPY ../ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index bigscreen/index.html;
  location / {
    try_files $uri $uri/ /bigscreen/index.html;
  }
}
EOF