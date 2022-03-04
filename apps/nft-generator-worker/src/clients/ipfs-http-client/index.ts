import { create } from 'ipfs-http-client';

const { IPFS_GATEWAY_URL, IPFS_GATEWAY_BASIC_AUTH } = process.env;
const ipfs = create({
  url: IPFS_GATEWAY_URL,
  apiPath: '/api/v0',
  headers: {
    authorization: `Basic ${IPFS_GATEWAY_BASIC_AUTH}`,
  },
});

export default ipfs;
