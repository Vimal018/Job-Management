import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Optional helper for clearing DB in testing
  async clearDatabase() {
    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_' && typeof this[key] === 'object');
    for (const model of models) {
      if (typeof this[model].deleteMany === 'function') {
        await this[model].deleteMany();
      }
    }
  }
}
