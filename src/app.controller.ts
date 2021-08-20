import { Controller, Get, Res, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Render } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  MainPageRedirect(@Res() res) {
    const userAuth = true;
    if (!userAuth) res.redirect('/login');
    else res.redirect('/news');
  }

  @Get('/news')
  @Render('news')
  News() {
    return {
      articles: [{ title: 'dtt' }, { title: 'fds' }, { title: 'gdgd' }],
    };
  }

  @Get('/login')
  @Render('login')
  Login() {
    return {};
  }

  @Get('/users')
  @Render('users')
  async users() {
    const UsersExport = await this.appService.getUsers();
    console.log(UsersExport);
    return { UsersExport };
  }

  @Get('/user/:id')
  @Render('user')
  async getUser(@Param('id') id: number) {
    const user = await this.appService.getUser(id);

    return { user };
  }
}
