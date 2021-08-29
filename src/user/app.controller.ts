import { Response } from 'express';
import {
  Controller,
  Get,
  Res,
  Param,
  Req,
  Request,
  HttpException,
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

    return { UsersExport, auth };
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
          res.status(404);
          res.send('404');
          throw 404;
        }
      });

    const posts = await this.appService
      .getWall(id, token)
      .catch((status: number) => {
        if (status == 404) {
          res.status(404);
          res.send('404');
          throw 404;
        }
      });
    console.log(typeof user);

    const auth = await this.appService
      .getUserByToken(token)
      .catch((status: number) => {
        if (status == 401) {
          //res.clearCookie();
          res.clearCookie('token');
          res.redirect('/login');
        }
      });

    return {
      user,
      posts,
      auth,
      title: `${user && user.username} - `,
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
          res.redirect('/login');
        }
      });

    return {
      user,
      auth,
      title: `${user.username} - `,
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
        res.redirect('/login');
        throw 401;
      }
    });
    return {
      auth,
      title: `${auth && auth.user && auth.user.username} - `,
    };
  }
}
