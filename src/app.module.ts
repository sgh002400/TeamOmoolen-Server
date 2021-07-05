import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MorganModule,
    TypeOrmModule.forFeature([Event]),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.DB_URL,
      database: process.env.DB_DATABASE,
      entities: [],
      autoLoadEntities: true,
      ssl: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
    AppService,
  ],
})
export class AppModule {}
