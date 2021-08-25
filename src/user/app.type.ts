export interface User {
  id: number;
  username: string;
  avatar: string;
}

export interface userExtend extends User {
  me: boolean;
  friend_status: {
    forme: boolean;
    status: number;
  };
  friends: {
    list: [User];
    count: number;
  };
}

export type ArrayUser = [
  {
    id: number;
    username: string;
    avatar: string;
  },
];

export type UsersExport = {
  users: ArrayUser;
  total: number;
};
export type UserAuth = {
  user: User;
  auth: boolean;
};
