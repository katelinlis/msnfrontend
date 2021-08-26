import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { response } from 'express';
import { UserAuth, userExtend, UsersExport } from './app.type.js';
let server_url;
if (process.env.NODE_ENV == 'production')
  server_url = 'http://localhost:3044/api';
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
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        if (err.response.status === 401) throw 401;
        return {
          user: { id: 0, username: '', me: false, friends: 0, avatar: '' },
          auth: false,
        };
      });
    const user = response;

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
    const response = await axios
      .get(`${server_url}/user/get/` + id, {
        headers: { authorization: 'beaber ' + token },
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
      });
    const user = response;

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
    const usersExport = await axios
      .get(`${server_url}/user/get/`)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
      });

    return usersExport;
  }
}
