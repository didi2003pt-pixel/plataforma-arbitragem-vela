FROM alpine:3.20 AS fetch
ARG SOURCE_GATEWAY_URL
ARG SOURCE_GATEWAY_TOKEN
RUN apk add --no-cache curl unzip python3
WORKDIR /src
COPY patches/fetch-source.sh /tmp/fetch-source.sh
RUN chmod 0755 /tmp/fetch-source.sh && /tmp/fetch-source.sh
COPY patches/mobile-fix.css /tmp/mobile-fix.css
COPY patches/mobile-fix.js /tmp/mobile-fix.js
COPY patches/apply-mobile1.py /tmp/apply-mobile1.py
RUN cp /tmp/mobile-fix.css /src/frontend/mobile-fix.css \
 && cp /tmp/mobile-fix.js /src/frontend/mobile-fix.js \
 && python3 /tmp/apply-mobile1.py /src/frontend

FROM nginx:1.27-alpine
COPY --from=fetch /src/frontend/ /usr/share/nginx/html/
COPY --from=fetch /src/frontend/nginx.conf /etc/nginx/conf.d/default.conf
RUN sig="$(dd if=/etc/nginx/conf.d/default.conf bs=1 count=3 2>/dev/null | od -An -tx1 | tr -d ' \n')" \
 && if [ "$sig" = "efbbbf" ]; then \
      dd if=/etc/nginx/conf.d/default.conf of=/tmp/default.conf bs=1 skip=3 2>/dev/null; \
      mv /tmp/default.conf /etc/nginx/conf.d/default.conf; \
    fi
EXPOSE 80
