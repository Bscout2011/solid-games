# Build stage
FROM node:lts-alpine as build
RUN npm i -g pnpm
WORKDIR /usr/src/app
COPY ["package.json", "pnpm-lock.yaml", "./"]
RUN pnpm install
COPY . .
RUN pnpm run build

# Production stage
FROM node:lts-alpine as production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]