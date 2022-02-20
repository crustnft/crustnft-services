import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import * as userService from '../users/service';
import { verifySignature } from '../../services/chain-service';
import { LoginDto } from './types';

export async function getUserNonce(account: string) {
  const nonce: number = Math.floor(Math.random() * 10000000);
  const message = `Welcome to CrustNft!

Click to sign in and accept the CrustNft Terms of Service: https://crustnft.io/tos

This request will not trigger a blockchain transaction or cost any gas fees.

Your authentication status will reset after 24 hours.

Wallet address:
${account}

Nonce:
${nonce}`;
  await userService.update({ account, nonce: nonce.toString() });
  return message;
}

export async function login(loginDto: LoginDto) {
  const { account, signature } = loginDto;
  const user = await userService.findById(account);
  const authenticated = verifySignature(account, signature, user.nonce);
  if (authenticated) {
    const jwtToken = await generateJwtToken(user);
    await userService.update({
      account,
      nonce: '',
    });
    return jwtToken;
  }
  throw new createHttpError[401]();
}

async function generateJwtToken(user) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        account: user.account,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
        issuer: process.env.JWT_ISSUER,
      },
      function (error, token) {
        if (!error) {
          return resolve(token);
        }
        return reject(error);
      }
    );
  });
}
