# Build stage
FROM oven/bun:1-alpine

WORKDIR /app

# Copy package files and lock file
COPY package.json bun.lock ./

# Install dependencies from lock file
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Build the application
RUN bun run build

# Expose port 4173
EXPOSE 4173

# Start Vite preview server
CMD ["bun", "run", "preview", "--host", "0.0.0.0"]