import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getName(): string {
    return 'Obaid Khan';
  }
  postName(): string {
    return 'post name here';
  }
}
