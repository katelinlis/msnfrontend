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
    const userAuth = true;
    if (!userAuth) res.redirect('/login');
    else res.redirect('/news');
  }

  @Get('/news')
  @Render('news')
  async News(@Req() request: RequestCoockie) {
    let token = '';
    if (request.cookies && request.cookies.token) token = request.cookies.token;
    const auth = await this.appService.getUserByToken(token).catch((err) => {
      return { auth: { status: false } };
    });

    return { auth: { user: auth, status: auth ? true : false } };
  }

  @Get('/login')
  @Render('login')
  async Login(@Req() request: RequestCoockie) {
    let token = '';
    if (request.cookies && request.cookies.token) token = request.cookies.token;
    const auth = await this.appService.getUserByToken(token).catch((err) => {
      return { auth: { status: false } };
    });

    return { auth: { user: auth, status: auth ? true : false } };
  }

  @Get('/users')
  @Render('users')
  async users(@Req() request: RequestCoockie) {
    const UsersExport = await this.appService.getUsers();
    let token = '';
    if (request.cookies && request.cookies.token) token = request.cookies.token;
    const auth = await this.appService.getUserByToken(token).catch((err) => {
      return { UsersExport, auth: { status: false } };
    });

    return { UsersExport, auth: { user: auth, status: auth ? true : false } };
  }

  @Get('/user/:id')
  @Render('user')
  async getUser(@Req() request: RequestCoockie, @Param('id') id: number) {
    let token = '';
    if (request.cookies && request.cookies.token) token = request.cookies.token;
    const user = await this.appService.getUser(id, token);

    const auth = await this.appService.getUserByToken(token).catch((err) => {
      return { user, auth: { status: false } };
    });

    return { user, auth: { user: auth, status: auth ? true : false } };
  }
}
