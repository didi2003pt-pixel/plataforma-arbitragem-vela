FROM alpine:3.20 AS fetch
ARG SOURCE_GATEWAY_URL
ARG SOURCE_GATEWAY_TOKEN
RUN apk add --no-cache curl tar gzip
WORKDIR /src
RUN test -n "$SOURCE_GATEWAY_URL" && test -n "$SOURCE_GATEWAY_TOKEN" \
 && curl --fail --silent --show-error \
      -H "Authorization: Bearer $SOURCE_GATEWAY_TOKEN" \
      "$SOURCE_GATEWAY_URL/artifact/frontend.tar.gz" \
      -o /tmp/frontend.tar.gz \
 && tar -xzf /tmp/frontend.tar.gz -C /src

FROM nginx:1.27-alpine
COPY --from=fetch /src/frontend/ /usr/share/nginx/html/
COPY --from=fetch /src/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
