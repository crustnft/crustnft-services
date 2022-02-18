FROM node:16-bullseye as dependency

WORKDIR /workdir

ARG SERVICE_NAME

COPY package.json package-lock.json ./
RUN npm install

# Development image
FROM dependency as development

WORKDIR /workdir

ARG SERVICE_NAME

ENV SERVICE_NAME=${SERVICE_NAME}
ENV NODE_ENV=development
ENV APP_ENV=local
ENV NODE_PATH=.

COPY ./ .

CMD ["sh" , "-c", "npm run start ${SERVICE_NAME}"]


# Builder to compile Typescript
FROM dependency as builder

WORKDIR /workdir

ARG SERVICE_NAME

ENV NODE_ENV=production
ENV NODE_PATH=.

COPY ./ .
RUN npx nx run ${SEVICE_NAME}:build:production

# Production image
FROM node:16-bullseye-slim as production

WORKDIR /workdir

ARG SERVICE_NAME

ENV NODE_ENV=production
ENV NODE_PATH=.

COPY --from=builder /workdir/dist/apps/${SERVICE_NAME} /workdir/
COPY --from=builder /workdir/package-lock.json /workdir/package-lock.json

RUN npm install --only=production

CMD ["node", "main.js"]
