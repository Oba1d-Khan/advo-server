import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LogInDto } from './dto/log-in.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
  @Post('login')
  logIn(@Body() LogInDto: LogInDto) {
    return this.authService.logIn(LogInDto);
  }

  // protected route
  @Get('profile')
  @UseGuards(AuthGuard()) // This line protects the route
  getProfile(@GetUser() user: User) {
    const { password, ...profile } = user;

    return profile;
  }
  // @Get(':id')
  // getProfile(@Param('id') id: string) {
  //   return this.authService.getProfile(+id);
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
