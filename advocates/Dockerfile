# Layer 1 NODE
FROM node:18 as builder

# Working directory for subsequent commands
WORKDIR /app

#Copy appliaction files into the docker image
COPY . .

# Install exact dependency versions
RUN npm ci

# Building app
RUN npm run build

# Layer 2 NGNIX
FROM nginx:1.21.0-alpine as production

# Set the environment to production
ENV NODE_ENV production

# Copying build assets from 'builder' image
COPY --from=builder /app/dist /usr/share/nginx/html

# Add the ngnix.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]