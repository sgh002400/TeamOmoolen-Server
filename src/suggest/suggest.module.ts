import { Module } from '@nestjs/common';
import { SuggestService } from './suggest.service';
import { SuggestController } from './suggest.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  providers: [SuggestService],
  controllers: [SuggestController],
})
export class SuggestModule {}
