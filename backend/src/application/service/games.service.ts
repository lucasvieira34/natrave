/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Game as GameModel } from '@prisma/client';
import { addDays, formatISO } from 'date-fns';

@Injectable()
export default class GamesService {
  constructor(private prisma: PrismaService) {}

  async listGamesWithDate(gameDate: Date): Promise<GameModel[]> {
    const where = gameDate
      ? {
          gameTime: {
            gte: gameDate,
            lt: formatISO(addDays(new Date(gameDate), 1)),
          },
        }
      : {};

    try {
      return await this.prisma.game.findMany({ where });
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
