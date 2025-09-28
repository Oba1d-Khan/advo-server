import { Controller, Get, Header, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  // @HttpCode(204)
  @Header('Cache-Control', 'no-store')
  postName(): string {
    return this.appService.postName();
  }

  @Get('/name')
  getName(): string {
    return this.appService.getName();
  }
}
