import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UserAuth, userExtend, UsersExport } from './app.type.js';
let server_url;
if (process.env.NODE_ENV == 'production')
  server_url = 'http://127.0.0.1:3044/api';
else server_url = 'https://social.katelinlis.xyz/api';

@Injectable()
export class UsersService {
  async getUserByToken(token: string): Promise<UserAuth> {
    if (token === '') {
      return {
        user: { id: 0, username: '', avatar: '' },
        auth: false,
      };
    }
    const response = await axios
      .get(`${server_url}/auth/user/`, {
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
        avatar: user.user.avatar,
      },
      auth: true,
    };
  }
  async getUser(id: number, token: string): Promise<userExtend> {
    const response = await axios.get(`${server_url}/user/get/` + id, {
      headers: { authorization: 'beaber ' + token },
    });
    const user = response.data;

    return {
      id: user.user.id,
      username: user.user.username,
      friends: user.user.friends,
      avatar: user.user.avatar,
      me: user.user.me,
      friend_status: user.friend_status,
    };
  }
  async getUsers(): Promise<UsersExport> {
    const response = await axios.get(`${server_url}/api/user/get/`);
    const user = response.data;

    return { users: user.users, total: user.total };
  }
}
