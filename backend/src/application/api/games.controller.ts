import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import GamesService from '../service/games.service';
import { Game as GameModel } from '@prisma/client';
import { HttpLoggingInterceptor } from '../../interceptor/http-logging.interceptor';

@UseInterceptors(HttpLoggingInterceptor)
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  public async listGamesWithDate(@Query('gameTime') gameDate: Date): Promise<GameModel[]> {
    return await this.gamesService.listGamesWithDate(gameDate);
  }
}
