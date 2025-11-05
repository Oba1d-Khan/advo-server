import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './entities/user.entity';

// This decorator simply grabs the 'user' object that our
// JwtStrategy attached to the request
export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
