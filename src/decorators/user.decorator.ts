import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserIdentifier } from 'src/auth/interfaces/user-identifier.interface';

export const User = createParamDecorator((key: 'id' | 'identifier', ctx: ExecutionContext) => {
  const request: { user: IUserIdentifier } = ctx.switchToHttp().getRequest();
  const user: IUserIdentifier = request.user;
  return key ? user[key] : user;
});
