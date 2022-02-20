export interface User {
  account: string;
  displayName: string;
  socialUrls?: string[];
  avatarUrl?: string;
  coverUrl?: string;
}

export type CreateUserDto = User;
export type UpdateUserDto = Partial<User> & { nonce: string };

export type UserQueryParams = Partial<User> & {
  pageSize: number;
  pageCursor?: string;
};
