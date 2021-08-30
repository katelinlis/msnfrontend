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
    const auth = await this.appService
      .getUserByToken(token)
      .catch((err) => {
        return err;
      })
      .catch((status: number) => {
        if (status == 401) {
          res.clearCookie();
          res.redirect('/login');
        }
      });
    const userAuth = auth.auth;
    if (!userAuth) res.redirect('/login');
    else res.redirect('/news');
  }

  @Get('/news')
  @Render('news')
  async News(@Req() request: RequestCoockie, @Res() res) {
    let token = '';
    if (request.cookies && request.cookies.token) token = request.cookies.token;
    const auth = await this.appService
      .getUserByToken(token)
      .catch((err) => {
        return err;
      })
      .catch((status: number) => {
        if (status == 401) {
          res.clearCookie();
          res.redirect('/login');
        }
      });

    const news = await this.appService
      .getNews(token)
      .catch((err) => {
        return err;
      })
      .catch((status: number) => {
        if (status == 401) {
          res.clearCookie();
          res.redirect('/login');
        }
      });

    return { auth, news };
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
