import { Module } from '@nestjs/common';
import { GamesController } from './api/games.controller';
import { HunchesController } from './api/hunches.controller';
import { LoginController } from './api/login.controller';
import { UserController } from './api/user.controller';
import GamesService from './service/games.service';
import HunchesService from './service/hunches.service';
import { PrismaService } from './service/prisma/prisma.service';
import UserService from './service/user.service';

@Module({
  controllers: [UserController, LoginController, GamesController, HunchesController],
  providers: [UserService, GamesService, HunchesService, PrismaService],
})
export class ApplicationModule {}
