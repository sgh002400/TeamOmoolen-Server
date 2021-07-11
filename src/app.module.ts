import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Guides } from './entities/Guides';
import { Tips } from './entities/Tips';
import { Users } from './entities/Users';
import { Products } from './entities/Products';
import { Events } from './entities/Events';
import { ProductsModule } from './products/products.module';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { SuggestModule } from './suggest/suggest.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MorganModule,
    TypeOrmModule.forFeature([Users, Tips, Products, Guides, Events]),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.DB_URL,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      ssl: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      keepConnectionAlive: true,
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    SuggestModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
    AppService,
    UsersService,
    AuthService,
  ],
})
export class AppModule {}
