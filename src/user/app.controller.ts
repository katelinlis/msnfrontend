import { Response } from 'express';
import {
  Controller,
  Get,
  Res,
  Param,
  Req,
  Request,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './app.service';
import { Render } from '@nestjs/common';

interface RequestCoockie extends Request {
  cookies: any;
}

@Controller()
export class UsersController {
  constructor(private readonly appService: UsersService) {}

  @Get('/users')
  @Render('users')
  async users(@Req() request: RequestCoockie) {
    const UsersExport = await this.appService.getUsers();
    let token = '';
    if (request.cookies && request.cookies.token) token = request.cookies.token;
    const auth = await this.appService.getUserByToken(token).catch((err) => {
      return err;
    });

    return {
      UsersExport,
      auth,
      description: `Список пользователей социальной сети Modern social`,
      keywords: `Пользователи, юзеры, список пользователей, участники соц сети, открытая социальная сеть, свободная социальная сеть`,
    };
  }

  @Get('/user/:id')
  @Render('user')
  async getUser(
    @Req() request: RequestCoockie,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    let token = '';
    if (request.cookies && request.cookies.token) token = request.cookies.token;

    const user = await this.appService
      .getUser(id, token)
      .catch((status: number) => {
        if (status == 404) {
          throw new NotFoundException();
          //throw 404;
        }
      });

    const posts = await this.appService
      .getWall(id, token)
      .catch((status: number) => {
        if (status == 404) {
          throw new NotFoundException();
          //throw 404;
        }
      });

    //if (!user) return;
    console.log(typeof user);

    const auth = await this.appService
      .getUserByToken(token)
      .catch((status: number) => {
        if (status == 401) {
          return 401;
        }
      });

    if (auth == 401) {
      //res.clearCookie('token').redirect('/login');
      res.clearCookie('token');
      throw new HttpException('not auth', 401);
    }

    const friendsDesc =
      user && user.friends.count > 0
        ? `дружит с ${user.friends.count} пользователями ${user.friends.list
            .slice(0, 6)
            .map((user, index) => {
              if (index < 6) return user.username;
            })}`
        : '';

    const postsDesc = posts
      ? `,написал(а) ${
          posts[0] ? `${posts[0].time + ': ' + posts[0].text}` : ''
        }`
      : '';

    if (typeof user == 'object' && user && user.username)
      return {
        user,
        news: posts,
        auth,
        title: `${user && user.username} - `,
        description: `Пользователь ${user.username} ${friendsDesc} ${postsDesc}`,
        keywords: `${user.username}, пользователь, участник, пользователь социальной сети, страница пользователя, страница ${user.username}, ${user.username} в соцсети`,
      };
  }

  @Get('/user/:id/friends')
  @Render('friends')
  async getUserFriends(
    @Req() request: RequestCoockie,
    @Res() res,
    @Param('id') id: number,
  ) {
    let token = '';
    if (request.cookies && request.cookies.token) token = request.cookies.token;
    const user = await this.appService.getUser(id, token);

    const auth = await this.appService
      .getUserByToken(token)
      .catch((status: number) => {
        if (status == 401) {
          res.clearCookie('token');
          throw new HttpException('not auth', 401);
          return;
        }
      });
    const friendsDesc =
      user && user.friends.count > 0
        ? `дружит с ${
            user.friends.count
          } пользователями ${user.friends.list.map((user, index) => {
            return user.username;
          })}
        `
        : '';

    if (typeof user == 'object' && user && user.username)
      return {
        user,
        auth,
        title: `друзья ${user && user.username} - `,
        description: `Друзья пользователя ${user.username} ${friendsDesc}`,
        keywords: `${user.username}, пользователь, участник, пользователь социальной сети, страница пользователя, страница ${user.username}, ${user.username} в соцсети`,
      };
  }
  @Get('/settings')
  @Render('settings')
  async userSettings(@Req() request: RequestCoockie, @Res() res) {
    let token = '';
    if (request.cookies && request.cookies.token) token = request.cookies.token;

    const auth = await this.appService.getUserByToken(token).catch((status) => {
      if (status == 401) {
        res.clearCookie('token');
        throw new HttpException('not auth', 401);
        return;
      }
    });
    return {
      auth,
      title: `${auth && auth.user && auth.user.username} - `,
    };
  }
}
