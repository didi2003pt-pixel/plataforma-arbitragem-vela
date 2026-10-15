FROM node:22-alpine AS deps
ARG SOURCE_GATEWAY_URL
ARG SOURCE_GATEWAY_TOKEN
WORKDIR /app
RUN apk add --no-cache curl unzip python3 make g++
COPY patches/fetch-source.sh /tmp/fetch-source.sh
RUN chmod 0755 /tmp/fetch-source.sh && /tmp/fetch-source.sh
COPY patches/mail.service.ts /tmp/mail.service.ts
RUN cp /tmp/mail.service.ts /app/src/notifications/mail.service.ts
COPY patches/apply-reg01.py /tmp/apply-reg01.py
RUN python3 /tmp/apply-reg01.py /app
COPY patches/apply-reg02.py /tmp/apply-reg02.py
RUN python3 /tmp/apply-reg02.py /app
COPY patches/apply-reg03.py /tmp/apply-reg03.py
RUN python3 /tmp/apply-reg03.py /app
COPY patches/apply-reg04.py /tmp/apply-reg04.py
RUN python3 /tmp/apply-reg04.py /app
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
