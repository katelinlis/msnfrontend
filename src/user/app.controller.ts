import { Controller, Get, Res, Param, Req, Request } from '@nestjs/common';
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
  async getUser(@Req() request: RequestCoockie, @Param('id') id: number) {
    let token = '';
    if (request.cookies && request.cookies.token) token = request.cookies.token;
    const user = await this.appService.getUser(id, token);

    const auth = await this.appService.getUserByToken(token).catch((err) => {
      return err;
    });

    return {
      user,
      auth,
      title: `${user.username} - `,
    };
  }

  @Get('/user/:id/friends')
  @Render('friends')
  async getUserFriends(
    @Req() request: RequestCoockie,
    @Param('id') id: number,
  ) {
    let token = '';
    if (request.cookies && request.cookies.token) token = request.cookies.token;
    const user = await this.appService.getUser(id, token);

    const auth = await this.appService.getUserByToken(token).catch((err) => {
      return err;
    });

    return {
      user,
      auth,
      title: `${user.username} - `,
    };
  }
  @Get('/settings')
  @Render('settings')
  async userSettings(@Req() request: RequestCoockie, @Param('id') id: number) {
    let token = '';
    if (request.cookies && request.cookies.token) token = request.cookies.token;
    const user = await this.appService.getUser(id, token);

    const auth = await this.appService.getUserByToken(token).catch((err) => {
      return err;
    });

    return {
      user,
      auth,
      title: `${user.username} - `,
    };
  }
}
