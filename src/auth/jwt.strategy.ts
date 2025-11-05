import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  id: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService, // Inject ConfigService to get the secret
  ) {
    // This is how the guard finds the token
    super({
      secretOrKey: configService.get('JWT_SECRET') || '',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // looks in the Authorization header for the Bearer token
    });
  }

  // This method is called by Passport *after* it verifies the token's
  // signature. Its job is to find the user in the DB.
  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new UnauthorizedException();
    }

    // This 'user' object is what Passport attaches to request.user
    return user;
  }
}
