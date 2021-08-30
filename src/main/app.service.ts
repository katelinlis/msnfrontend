import { Injectable } from '@nestjs/common';
import axios from 'axios';
import redis from 'redis';
let server_url;
if (process.env.NODE_ENV == 'production')
  server_url = 'http://localhost:3044/api';
else server_url = 'https://social.katelinlis.xyz/api';
let clientRedis;
if (process.env.NODE_ENV == 'production') {
  clientRedis = redis.createClient();
  clientRedis.on('error', function (error) {
    console.error(error);
  });
}

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
export class MainService {
  async getUserByToken(token: string): Promise<UserAuth> {
    if (token === '') {
      return {
        user: { id: 0, username: '', me: false, friends: 0, avatar: '' },
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
        friends: user.user.friends,
        avatar: user.user.avatar,
        me: user.user.me,
      },
      auth: true,
    };
  }
  async getUser(id: number, token: string): Promise<user> {
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
    };
  }

  async getFromRedis(request): Promise<any> {
    return new Promise((resolve, reject) => {
      if (process.env.NODE_ENV == 'production' && clientRedis)
        clientRedis.get(request, function (err, res) {
          if (err) reject(err);
          if (res) {
            resolve(JSON.parse(res));
          } else {
            reject(false);
          }
        });
      else reject(false);
    });
  }

  async getNews(token: string): Promise<any> {
    const response = await this.getFromRedis(`newsget/${token}`).catch(
      async (err) => {
        const data_from_server = await this.requestNewsServer(token);
        if (process.env.NODE_ENV == 'production') {
          await clientRedis.set(
            `newsget/${token}`,
            JSON.stringify(data_from_server),
          );
          clientRedis.expire(`newsget/${token}`, 15);
        }
        return data_from_server;
      },
    );

    return response;
  }

  async requestNewsServer(token): Promise<any> {
    const response = await axios
      .get(`${server_url}/wall/get/`, {
        headers: { authorization: 'bearer ' + token },
      })
      .then((response) => {
        if (response) {
          return response.data;
        }
        return response;
      })
      .catch((err) => {
        if (err.response.status === 404) throw 404;
        return {};
      });
    return response;
  }

  async getUsers(): Promise<UsersExport> {
    const response = await axios.get(`${server_url}/user/get/`);
    const user = response.data;

    return { users: user.users, total: user.total };
  }
}
