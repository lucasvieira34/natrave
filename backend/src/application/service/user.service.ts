/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { User as UserEntity } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AuthModel, User } from '../../model/auth.model';
import { UserModel } from '../../model/user.model';

@Injectable()
export default class UserService {
  constructor(private prisma: PrismaService) {}

  async allUsers(): Promise<UserEntity[]> {
    return this.prisma.user.findMany();
  }

  async createUser(userDto: UserModel): Promise<any> {
    const passwordEncoded = await bcrypt.hash(userDto.password, 10);
    try {
      const { password, ...user } = await this.prisma.user.create({ data: { ...userDto, password: passwordEncoded } });
      return user;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async login(authorization: string): Promise<AuthModel> {
    const token = authorization.split(' ')[1];
    const [email, plainTextPassword] = atob(token).split(':');

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      if (!(await bcrypt.compare(plainTextPassword, user.password))) {
        throw new HttpException('Senha inválida.', HttpStatus.BAD_REQUEST);
      }

      const accessToken = jwt.sign(
        {
          sub: user.id,
          name: user.name,
          expiresIn: '7d',
        },
        process.env.JWT_SECRET,
      );

      return new AuthModel()
        .setAccessToken(accessToken)
        .setUser(
          new User()
            .setId(user.id)
            .setName(user.name)
            .setUsername(user.username)
            .setEmail(user.email)
            .setCreatedAt(user.createdAt)
            .setUpdatedAt(user.updatedAt),
        );
    } else {
      throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);
    }
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);
    } else {
      return user;
    }
  }
}
