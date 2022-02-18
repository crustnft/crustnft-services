# Crust-NFT-Explore

## Prerequisite

## Development

### explore-api

- envs `cp -n apps/explore-api/.env.sample apps/explore-api/.env.local`
- start `npm run start explore-api`

## Deployment

### Build docker images

```
docker build -t explore-api --build-arg=SERVICE_NAME=explore-api  --target=production .
```

### Local

- [Cloud Functions](https://cloud.google.com/sdk/gcloud/reference/functions/deploy)

```
#!/bin/sh

SERVICE_NAME=explore-api

npx nx run ${SERVICE_NAME}:build:production

gcloud functions deploy ${SEVICE_NAME} --entry-point=api --runtime nodejs16 \
 --source=dist/apps/${SEVICE_NAME} \
 --region=us-east1 \
 --set-env-vars APP_ENV=prod \
 --trigger-http --allow-unauthenticated

```

- [Cloud Run](https://cloud.google.com/sdk/gcloud/reference/run/deploy)

```
gcloud builds submit --config cloudbuild-runs.yaml . --substitutions=SHORT_SHA=local,APP_ENV=stage
```
