FROM registry.cn-guangzhou.aliyuncs.com/wuntsong_pub/nnodert:2023-12-20-19-41-20 as builder

WORKDIR /tmp/build
RUN mkdir -p /tmp/build

COPY . .
RUN mv .env.production .env

RUN pnpm install
RUN pnpm run build

FROM registry.cn-guangzhou.aliyuncs.com/wuntsong_pub/nnodert:2023-12-20-19-41-20

WORKDIR /var/nuxt
RUN mkdir -p /var
# nuxt不用创建，如下直接复制

COPY --from=builder /tmp/build/.output /var/nuxt

RUN addgroup  -g 1131 huan && adduser -u 1130 -D -G huan huan
USER 1130

ENTRYPOINT ["node", "/var/nuxt/server/index.mjs"]
