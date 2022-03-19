import crypto from 'crypto';

export default function sha1(data: string) {
  return crypto.createHash('sha1').update(data, 'binary').digest('hex');
}
