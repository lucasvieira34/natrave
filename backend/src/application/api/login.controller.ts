import { Controller, Get, Headers, UseInterceptors } from '@nestjs/common';
import { HttpLoggingInterceptor } from '../../interceptor/http-logging.interceptor';
import { AuthModel } from '../../model/auth.model';
import UserService from '../service/user.service';

@UseInterceptors(HttpLoggingInterceptor)
@Controller('login')
export class LoginController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async login(@Headers('authorization') authorization: string): Promise<AuthModel> {
    return await this.userService.login(authorization);
  }
}
