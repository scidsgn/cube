FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

ADD . /app
WORKDIR /app

RUN uv sync --locked

RUN chmod +x ./run.sh

CMD ["/bin/bash", "-c", "./run.sh"]