FROM hayd/alpine-deno:latest

ARG app_port

EXPOSE ${app_port}

WORKDIR /app

USER deno

COPY deps.ts .
RUN deno cache deps.ts

COPY . .
RUN deno cache mod.ts

CMD ["run", "--allow-read", "--allow-net", "--allow-env", "mod.ts"]