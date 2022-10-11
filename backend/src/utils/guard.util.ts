import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const getUserIdByToken = (authorization: string): any => {
  const token = authorization.split(' ')[1];
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return data.sub;
  } catch (err) {
    throw new UnauthorizedException();
  }
};
