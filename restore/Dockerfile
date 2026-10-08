FROM postgres:17-bookworm
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
COPY run.sh /usr/local/bin/fpv-restore
RUN chmod 0755 /usr/local/bin/fpv-restore
ENTRYPOINT ["/usr/local/bin/fpv-restore"]
