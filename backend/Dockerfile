FROM node:22-alpine AS deps
ARG SOURCE_GATEWAY_URL
ARG SOURCE_GATEWAY_TOKEN
WORKDIR /app
RUN apk add --no-cache curl unzip python3 make g++
RUN test -n "$SOURCE_GATEWAY_URL" && test -n "$SOURCE_GATEWAY_TOKEN" \
 && curl --fail --silent --show-error \
      -H "Authorization: Bearer $SOURCE_GATEWAY_TOKEN" \
      "$SOURCE_GATEWAY_URL/artifact/backend.zip" \
      -o /tmp/backend.zip \
 && (unzip -q /tmp/backend.zip -d /app || [ "$?" -eq 1 ])
COPY patches/mail.service.ts /tmp/mail.service.ts
RUN cp /tmp/mail.service.ts /app/src/notifications/mail.service.ts
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
