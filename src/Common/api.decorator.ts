import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function CommonApiQueries() {
  return applyDecorators(
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'orderBy', required: false, enum: ['asc', 'desc'] }),
  );
}
