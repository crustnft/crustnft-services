import { GoogleAuth, IdTokenClient } from 'google-auth-library';

const auth = new GoogleAuth();
let client: IdTokenClient;

export async function getGoogleClientHeaders(serviceUrl: string) {
  if (!client) client = await auth.getIdTokenClient(serviceUrl);
  const clientHeaders = await client.getRequestHeaders();
  return clientHeaders;
}
