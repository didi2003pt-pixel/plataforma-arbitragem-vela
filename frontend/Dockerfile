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

COPY patches/pilot-register-referee.js /tmp/pilot-register-referee.js
COPY patches/apply-reg01.py /tmp/apply-reg01.py
RUN cp /tmp/pilot-register-referee.js /src/frontend/pilot-register-referee.js \
 && python3 /tmp/apply-reg01.py /src/frontend

COPY patches/pilot-profile-ui.js /tmp/pilot-profile-ui.js
COPY patches/pilot-profile-ui.css /tmp/pilot-profile-ui.css
COPY patches/apply-reg05.py /tmp/apply-reg05.py
RUN cp /tmp/pilot-profile-ui.js /src/frontend/pilot-profile-ui.js \
 && cp /tmp/pilot-profile-ui.css /src/frontend/pilot-profile-ui.css \
 && python3 /tmp/apply-reg05.py /src/frontend


COPY patches/pilot-availability-areas.js /tmp/pilot-availability-areas.js
COPY patches/pilot-availability-areas.css /tmp/pilot-availability-areas.css
COPY patches/apply-avail01.py /tmp/apply-avail01.py
RUN cp /tmp/pilot-availability-areas.js /src/frontend/pilot-availability-areas.js \
 && cp /tmp/pilot-availability-areas.css /src/frontend/pilot-availability-areas.css \
 && python3 /tmp/apply-avail01.py /src/frontend


COPY patches/pilot-event-templates.js /tmp/pilot-event-templates.js
COPY patches/pilot-event-templates.css /tmp/pilot-event-templates.css
COPY patches/apply-event-template01.py /tmp/apply-event-template01.py
RUN cp /tmp/pilot-event-templates.js /src/frontend/pilot-event-templates.js \
 && cp /tmp/pilot-event-templates.css /src/frontend/pilot-event-templates.css \
 && python3 /tmp/apply-event-template01.py /src/frontend


COPY patches/pilot-credentials-edit.js /tmp/pilot-credentials-edit.js
COPY patches/pilot-credentials-edit.css /tmp/pilot-credentials-edit.css
COPY patches/apply-cred01.py /tmp/apply-cred01.py
RUN cp /tmp/pilot-credentials-edit.js /src/frontend/pilot-credentials-edit.js \
 && cp /tmp/pilot-credentials-edit.css /src/frontend/pilot-credentials-edit.css \
 && python3 /tmp/apply-cred01.py /src/frontend

COPY patches/apply-avail02.py /tmp/apply-avail02.py
RUN python3 /tmp/apply-avail02.py /src/frontend

FROM nginx:1.27-alpine
COPY --from=fetch /src/frontend/ /usr/share/nginx/html/
COPY --from=fetch /src/frontend/nginx.conf /etc/nginx/conf.d/default.conf
RUN sig="$(dd if=/etc/nginx/conf.d/default.conf bs=1 count=3 2>/dev/null | od -An -tx1 | tr -d ' \n')" \
 && if [ "$sig" = "efbbbf" ]; then \
      dd if=/etc/nginx/conf.d/default.conf of=/tmp/default.conf bs=1 skip=3 2>/dev/null; \
      mv /tmp/default.conf /etc/nginx/conf.d/default.conf; \
    fi
EXPOSE 80
