import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import UserService from '../service/user.service';
import { User as UserModel } from '@prisma/client';
import { HttpLoggingInterceptor } from '../../interceptor/http-logging.interceptor';

@UseInterceptors(HttpLoggingInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async allUsers(): Promise<UserModel[]> {
    return await this.userService.allUsers();
  }

  @Post()
  public async createUser(@Body() user: UserModel): Promise<any> {
    return await this.userService.createUser(user);
  }
}
