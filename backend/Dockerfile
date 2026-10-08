FROM node:22-alpine AS deps
ARG SOURCE_GATEWAY_URL
ARG SOURCE_GATEWAY_TOKEN
WORKDIR /app
RUN apk add --no-cache curl tar gzip python3 make g++
RUN test -n "$SOURCE_GATEWAY_URL" && test -n "$SOURCE_GATEWAY_TOKEN" \
 && curl --fail --silent --show-error \
      -H "Authorization: Bearer $SOURCE_GATEWAY_TOKEN" \
      "$SOURCE_GATEWAY_URL/artifact/backend.tar.gz" \
      -o /tmp/backend.tar.gz \
 && tar -xzf /tmp/backend.tar.gz -C /tmp \
 && cp -a /tmp/backend/. /app/
RUN npm install --no-audit --no-fund

FROM deps AS build
RUN npx prisma generate && npm run build
RUN npm prune --omit=dev

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache su-exec
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/assets ./assets
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod 0755 /usr/local/bin/docker-entrypoint.sh \
 && mkdir -p /app/storage \
 && chown -R node:node /app
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push --skip-generate && npx prisma db execute --file prisma/post-push.sql --schema prisma/schema.prisma && node dist/src/main.js"]
