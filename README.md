# Crust-NFT-Explore

## Deployment

### Local

Create a bash file `deploy-explore-api.sh`

```
#!/bin/sh

SERVICE_NAME=explore-api

npx nx run ${SERVICE_NAME}:build:production

gcloud functions deploy ${SERVICE_NAME} --entry-point=api --runtime nodejs16 \
 --source=dist/apps/${SERVICE_NAME} \
 --trigger-http --allow-unauthenticated

```
