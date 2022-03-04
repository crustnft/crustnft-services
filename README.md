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
gcloud builds submit --config .cloudbuild/cloudbuild-functions.yaml . --substitutions=_APP_ENV=stage

```

- [Cloud Run](https://cloud.google.com/sdk/gcloud/reference/run/deploy)

```
gcloud builds submit --config .cloudbuild/cloudbuild-runs.yaml . --substitutions=SHORT_SHA=local,_APP_ENV=stage,_REGION=abc-xyz
```

# IPFS

## Gateway

- https://gw.crustapps.net/ipfs/CID
- https://gateway.ipfs.io/ipfs/CID
