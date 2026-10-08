FROM alpine:3.20 AS fetch
ARG SOURCE_GATEWAY_URL
ARG SOURCE_GATEWAY_TOKEN
RUN apk add --no-cache curl unzip
WORKDIR /src
RUN test -n "$SOURCE_GATEWAY_URL" && test -n "$SOURCE_GATEWAY_TOKEN" \
 && curl --fail --silent --show-error \
      -H "Authorization: Bearer $SOURCE_GATEWAY_TOKEN" \
      "$SOURCE_GATEWAY_URL/artifact/frontend.zip" \
      -o /tmp/frontend.zip \
 && mkdir -p /src/frontend \
 && (unzip -q /tmp/frontend.zip -d /src/frontend || [ "$?" -eq 1 ])

FROM nginx:1.27-alpine
COPY --from=fetch /src/frontend/ /usr/share/nginx/html/
COPY --from=fetch /src/frontend/nginx.conf /etc/nginx/conf.d/default.conf
RUN sig="$(dd if=/etc/nginx/conf.d/default.conf bs=1 count=3 2>/dev/null | od -An -tx1 | tr -d ' \n')" \
 && if [ "$sig" = "efbbbf" ]; then \
      dd if=/etc/nginx/conf.d/default.conf of=/tmp/default.conf bs=1 skip=3 2>/dev/null; \
      mv /tmp/default.conf /etc/nginx/conf.d/default.conf; \
    fi
EXPOSE 80
