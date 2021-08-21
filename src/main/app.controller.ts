import { Controller, Get, Res, Param, Req, Request } from '@nestjs/common';
import { MainService } from './app.service';
import { Render } from '@nestjs/common';

interface RequestCoockie extends Request {
  cookies: any;
}

@Controller()
export class MainController {
  constructor(private readonly appService: MainService) {}

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
}
