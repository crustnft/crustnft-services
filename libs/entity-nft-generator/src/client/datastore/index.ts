import { Datastore } from '@google-cloud/datastore';
const projectId = process.env.GCP_PROJECT;
const datastore = new Datastore({
  projectId,
});

export default datastore;
