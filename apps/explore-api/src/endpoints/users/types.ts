export interface User {
  account: string;
  displayName: string;
  socialUrls?: string[];
  avatarUrl?: string;
  coverUrl?: string;
}

export type CreateUserDto = User;
export type UpdateUserDto = User;

export type UserQueryParams = Partial<User> & {
  pageSize: number;
  pageCursor?: string;
};
