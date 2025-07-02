import { State } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class BaseSearchDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullname?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @IsOptional()
  @IsEnum(['true', 'false'])
  @IsNotEmpty()
  isActive?: string;

  @IsOptional()
  @IsEnum(['true', 'false'])
  @IsNotEmpty()
  isArchive?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  orderBy?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(['true', 'false'])
  @IsNotEmpty()
  isDeleted?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateFrom?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateTo?: Date;

  @IsOptional()
  @IsEnum(['CUSTOMER', 'OWNER', 'SELLER', 'STAFF'])
  role?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsEnum(State)
  state?: State;

  @IsOptional()
  @IsString()
  search?: string;
}
