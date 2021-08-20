import { Injectable } from '@nestjs/common';
import axios from 'axios';

type user = {
  id: number;
  username: string;
  me: boolean;
  friends: number;
  avatar: string;
};

@Injectable()
export class AppService {
  async getUser(id: number): Promise<user> {
    const response = await axios.get(
      'https://social.katelinlis.xyz/api/user/get/' + id,
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
}
