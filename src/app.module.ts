import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CacheModule } from '@nestjs/cache-manager'

import KeyvRedis from '@keyv/redis'

import { AppController } from './app.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
    }),
    process.env.ENABLE_REDIS === '1'
      ? CacheModule.registerAsync({
          useFactory: async (configService: ConfigService) => ({
            stores: [new KeyvRedis(configService.getOrThrow('REDIS_URI'))],
          }),
          inject: [ConfigService],
          isGlobal: true,
        })
      : CacheModule.register({
          isGlobal: true,
        }),
    AppModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
