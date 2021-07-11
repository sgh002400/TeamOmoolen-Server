import { Module } from '@nestjs/common';
import { SuggestService } from './suggest.service';
import { SuggestController } from './suggest.controller';
import { ProductsModule } from '../products/products.module';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ProductsModule, UsersModule],
  providers: [SuggestService, UsersService],
  controllers: [SuggestController],
})
export class SuggestModule {}
