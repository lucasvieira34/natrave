import { Body, Controller, Post, Headers, UnauthorizedException, Get, Param, UseInterceptors } from '@nestjs/common';
import { HunchModel } from '../../model/hunch.model';
import HunchesService from '../service/hunches.service';
import { Hunch as HunchEntity } from '@prisma/client';
import { HttpLoggingInterceptor } from '../../interceptor/http-logging.interceptor';

@UseInterceptors(HttpLoggingInterceptor)
@Controller('hunches')
export class HunchesController {
  constructor(private readonly hunchesService: HunchesService) {}

  @Get()
  public async listAll(): Promise<any> {
    return await this.hunchesService.listAll();
  }

  @Get('/:username')
  public async listHunches(@Param('username') username: string): Promise<any> {
    return await this.hunchesService.listHunchesByUsername(username);
  }

  @Post()
  public async createHunch(
    @Body() hunchModel: HunchModel,
    @Headers('authorization') authorization?: string,
  ): Promise<HunchEntity> {
    if (!authorization) {
      throw new UnauthorizedException();
    }
    return await this.hunchesService.createHunch(hunchModel, authorization);
  }
}
