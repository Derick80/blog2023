# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=21.1.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Remix/Prisma"

# Remix/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV=production


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential openssl

# Install node modules
COPY --link package.json package-lock.json .
RUN npm install --production=false

# Generate Prisma Client
COPY --link prisma .
RUN npx prisma generate

# Copy application code
COPY --link . .

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --production


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Entrypoint prepares the database.

# Start the server by default, this can be overwritten at runtime
CMD [ "npm", "run", "start" ]