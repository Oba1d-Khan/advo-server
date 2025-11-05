import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { LogInDto } from './dto/log-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  id: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ message: string }> {
    const { name, email, password } = signUpDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
      return { message: 'User successfully created!' };
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async logIn(logInDto: LogInDto) {
    const { email, password } = logInDto;

    const user = await this.userRepository.findOneBy({ email });

    // if (!user) throw new NotFoundException('User not found!');

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { id: user.id, email: user.email };

      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      if (!user) throw new NotFoundException('User not found!');
      else
        throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async getProfile(id: number) {
    // const
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
