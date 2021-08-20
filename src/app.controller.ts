import { Controller, Get, Res, Param, Req, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { Render } from '@nestjs/common';

interface RequestCoockie extends Request {
  cookies: any;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async MainPageRedirect(@Req() request: RequestCoockie, @Res() res) {
    let token = '';
    if (request.cookies && request.cookies.token) token = request.cookies.token;
    const auth = await this.appService.getUserByToken(token).catch((err) => {
      return err;
    });
    const userAuth = auth.auth;
    if (!userAuth) res.redirect('/login');
    else res.redirect('/news');
  }

  @Get('/news')
  @Render('news')
  async News(@Req() request: RequestCoockie) {
    let token = '';
    if (request.cookies && request.cookies.token) token = request.cookies.token;
    const auth = await this.appService.getUserByToken(token).catch((err) => {
      return err;
    });

    return { auth };
  }

  @Get('/login')
  @Render('login')
  async Login(@Req() request: RequestCoockie) {
    let token = '';
    if (request.cookies && request.cookies.token) token = request.cookies.token;
    const auth = await this.appService.getUserByToken(token).catch((err) => {
      return err;
    });

    return { auth };
  }

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
}
