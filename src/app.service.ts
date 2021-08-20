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

@Injectable()
export class AppService {
  async getUserByToken(token: string): Promise<user> {
    const response = await axios
      .get('https://social.katelinlis.xyz/api/auth/user/', {
        headers: { authorization: 'beaber ' + token },
      })
      .catch(() => {
        throw 'no auth';
      });
    const user = response.data;
    console.log(user);
    return {
      id: user.user.id,
      username: user.user.username,
      friends: user.user.friends,
      avatar: user.user.avatar,
      me: user.user.me,
    };
  }
  async getUser(id: number, token: string): Promise<user> {
    const response = await axios.get(
      'https://social.katelinlis.xyz/api/user/get/' + id,
      { headers: { authorization: 'beaber ' + token } },
    );
    const user = response.data;
    console.log(user);
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
