import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as redis from 'redis';
import { UserAuth, userExtend, UsersExport } from './app.type.js';
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
        if (response) return response.data;
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
  async getFromRedis(request): Promise<userExtend> {
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
  async getUser(id: number, token: string): Promise<userExtend> {
    const response = await this.getFromRedis(
      'userget/' + id + '' + token,
    ).catch(async (err) => {
      const data_from_server = await this.requestUserServer(id, token);
      if (process.env.NODE_ENV == 'production') {
        await clientRedis.set(
          'userget/' + id + '' + token,
          JSON.stringify(data_from_server),
        );
        clientRedis.expire('userget/' + id + '' + token, 15);
      }
      return data_from_server;
    });

    return response;
  }

  async getWall(id: number, token: string): Promise<userExtend> {
    const response = await this.getFromRedis('wallget/' + id).catch(
      async (err) => {
        const data_from_server = await this.requestWallServer(id, token);
        if (process.env.NODE_ENV == 'production') {
          await clientRedis.set(
            'wallget/' + id,
            JSON.stringify(data_from_server),
          );
          clientRedis.expire('wallget/' + id + '' + token, 15);
        }
        return data_from_server;
      },
    );

    return response;
  }

  async requestWallServer(id, token): Promise<userExtend> {
    const response = await axios
      .get(`${server_url}/wall/get/` + id, {
        headers: { authorization: 'bearer ' + token },
      })
      .then((response) => {
        if (response) {
          const user = response.data.posts;
          return user;
        }
        return response;
      })
      .catch((err) => {
        if (err.response.status === 404) throw 404;
        return {};
      });
    return response;
  }

  async requestUserServer(id, token): Promise<userExtend> {
    const response = await axios
      .get(`${server_url}/user/get/` + id, {
        headers: { authorization: 'bearer ' + token },
      })
      .then((response) => {
        if (response) {
          const user = response.data.user;
          user['friend_status'] = response.data.friend_status;
          return user;
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
    const usersExport = await axios
      .get(`${server_url}/user/get/`)
      .then((response) => {
        if (response) return response.data;
      })
      .catch((err) => {
        console.log(err);
      });

    return usersExport;
  }
}
