import { Injectable } from '@nestjs/common';
import axios from 'axios';

type user = {
  id: number;
  username: string;
  me: boolean;
  friends: number;
  avatar: string;
};

type ArrayUser = [
  {
    id: number;
    username: string;
    avatar: string;
  },
];

type UsersExport = {
  users: ArrayUser;
  total: number;
};
type UserAuth = {
  user: user;
  auth: boolean;
};
@Injectable()
export class UsersService {
  async getUserByToken(token: string): Promise<UserAuth> {
    if (token === '') {
      return {
        user: { id: 0, username: '', me: false, friends: 0, avatar: '' },
        auth: false,
      };
    }

    const response = await axios
      .get('https://social.katelinlis.xyz/api/auth/user/', {
        headers: { authorization: 'beaber ' + token },
      })
      .catch(() => {
        throw {
          user: { id: 0, username: '', me: false, friends: 0, avatar: '' },
          auth: false,
        };
      });
    const user = response.data;

    return {
      user: {
        id: user.user.id,
        username: user.user.username,
        friends: user.user.friends,
        avatar: user.user.avatar,
        me: user.user.me,
      },
      auth: true,
    };
  }
  async getUser(id: number, token: string): Promise<user> {
    const response = await axios.get(
      'https://social.katelinlis.xyz/api/user/get/' + id,
      { headers: { authorization: 'beaber ' + token } },
    );
    const user = response.data;

    return {
      id: user.user.id,
      username: user.user.username,
      friends: user.user.friends,
      avatar: user.user.avatar,
      me: user.user.me,
    };
  }
  async getUsers(): Promise<UsersExport> {
    const response = await axios.get(
      'https://social.katelinlis.xyz/api/user/get/',
    );
    const user = response.data;

    return { users: user.users, total: user.total };
  }
}
