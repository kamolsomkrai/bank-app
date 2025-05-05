# Stage 1: Builder
FROM node:18-bullseye  AS builder

# # 1. ตั้งค่าพื้นฐาน
# RUN apk add --no-cache git && \
#     echo "nameserver 8.8.8.8" > /etc/resolv.conf

# 2. ตั้งค่า Yarn
RUN corepack enable && \
    yarn config set network-timeout 300000 -g && \
    yarn config set cache-folder /tmp/.yarn-cache

# 3. ติดตั้ง dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# 4. ติดตั้ง SWC เฉพาะสำหรับ Alpine (musl)
# RUN yarn add @next/swc-linux-x64-musl

# 5. Build application
COPY . .
RUN yarn build && \
    yarn cache clean

# Stage 2: Runner
FROM node:18-bullseye AS runner
WORKDIR /app

# 1. ตั้งค่า non-root user
RUN chown node:node /app
USER node

# 2. Copy only necessary files
COPY --from=builder --chown=node:node /app/package.json .
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# 3. Runtime settings
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
CMD ["yarn", "start"]