/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { HunchModel } from '../../model/hunch.model';
import { getUserIdByToken } from 'src/utils/guard.util';
import { Hunch as HunchEntity } from '@prisma/client';
import UserService from './user.service';

@Injectable()
export default class HunchesService {
  constructor(private prisma: PrismaService, private userService: UserService) {}

  async listAll(): Promise<any> {
    return await this.prisma.hunch.findMany();
  }

  async listHunchesByUsername(username: string): Promise<any> {
    const user = await this.userService.getUserByUsername(username);

    const hunches = await this.prisma.hunch.findMany({
      where: { userId: user.id },
    });

    return { name: user.name, hunches };
  }

  async createHunch(hunchModel: HunchModel, authorization: string): Promise<HunchEntity> {
    const { gameId, homeTeamScore, awayTeamScore } = hunchModel;
    if (!homeTeamScore && !awayTeamScore) {
      throw new HttpException('Os palpites não foram preenchidos corretamente.', HttpStatus.BAD_REQUEST);
    }

    const userId = getUserIdByToken(authorization);

    try {
      const [hunch] = await this.prisma.hunch.findMany({
        where: { gameId, userId },
      });

      return hunch
        ? await this.prisma.hunch.update({
            where: {
              id: hunch.id,
            },
            data: {
              homeTeamScore,
              awayTeamScore,
            },
          })
        : await this.prisma.hunch.create({
            data: { userId, gameId, homeTeamScore, awayTeamScore },
          });
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
