import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ctx = context.getArgByIndex(2); // GraphQL context
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const authHeader = ctx.req.headers.authorization;

    if (!authHeader) return false;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, 'SECRETKEY');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ctx.user = decoded;
      return true;
    } catch {
      return false;
    }
  }
}
