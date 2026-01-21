# Step 1: Build React app
FROM node:18-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve with NGINX
FROM nginx:alpine
# Copy NGINX config for React Router SPA support
COPY nginx/service.conf /etc/nginx/conf.d/default.conf
# Copy built app from Vite (outputs to dist/ not build/)
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]