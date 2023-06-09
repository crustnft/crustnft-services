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

- [Google App Engine](https://cloud.google.com/build/docs/deploying-builds/deploy-appengine)

```
gcloud builds submit --config .cloudbuild/cloudbuild-app-engine.yaml . --substitutions=SHORT_SHA=local
```

- All in one

```
gcloud builds submit --config .cloudbuild/cloudbuild-all.yaml . --substitutions=SHORT_SHA=local,_APP_ENV=stage,_REGION=us-east1,_SERVICE_ACCOUNT=
```

### Production

Create a new tag to deploy production

Versioning : https://semver.org/

Tagging:

- Add a tag in your current branch: `git tag tag_name`
- Check if it's created or not: `git tag`
- Push in your remote origin: `git push origin tag_name`

# IPFS

## Gateway

- https://gw.crustapps.net/ipfs/CID
- https://gateway.ipfs.io/ipfs/CID
