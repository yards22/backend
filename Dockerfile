# multistage build to slim down api-server image size.
# stage 1 build the application on node:14 image.
FROM node:17-slim AS Builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY src/infra/db/schema.prisma ./schema.prisma
RUN npm install --no-cache
COPY . .
RUN npx prisma
RUN npx prisma generate 
RUN npm run build
RUN npm prune --production
COPY .env ./
EXPOSE 4000
CMD ["node","dist/cmd/http_api/main.js"]

# stage 2 copy the artifacts from above build to alpine image(4 MB).
# FROM node:17-alpine
# WORKDIR /app
# # Copy only the necessary files from the builder stage
# COPY --from=Builder /app/prisma ./prisma/
# COPY --from=Builder /app/dist ./dist/
# COPY --from=Builder /app/.env .env
# COPY --from=Builder /app/node_modules ./node_modules/
# EXPOSE 4000
# CMD ["node","dist/cmd/http_api/main.js"]
