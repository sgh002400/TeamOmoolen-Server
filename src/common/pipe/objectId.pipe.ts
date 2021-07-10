import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ObjectId = require('mongodb').ObjectID;

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return ObjectId(value);
  }
}
