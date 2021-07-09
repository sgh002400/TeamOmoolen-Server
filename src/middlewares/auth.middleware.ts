import { CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

export default class AuthGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const { access_token } = request.headers;

    if (access_token === undefined) {
      throw new HttpException('토큰이 전송되지 않았습니다.', 401);
    }
    request.user = this.validateToken(access_token);
    return true;
  }

  public validateToken(token: string): string {
    try {
      const verify: string = jwt.verify(
        token,
        process.env.JWT_SECRET,
      ) as string;
      return verify;
    } catch (error) {
      switch (error.message) {
        case 'INVALID_TOKEN':
        case 'TOKEN_IS_ARRAY':
        case 'NO_USER':
          throw new HttpException('유효하지 않은 토큰입니다.', 401);
        case 'EXPIRED_TOKEN':
          throw new HttpException('토큰이 만료되었습니다.', 410);
        default:
          throw new HttpException('서버 오류입니다.', 500);
      }
    }
  }
}