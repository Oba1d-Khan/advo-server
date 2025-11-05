import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // register passport
    JwtModule.registerAsync({
      imports: [ConfigModule], // 3. Import ConfigModule here
      inject: [ConfigService], // 4. Inject ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'), // 5. Read from .env
        signOptions: {
          expiresIn: 3600, // 1 hour
        },
      }),
    }),

    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
