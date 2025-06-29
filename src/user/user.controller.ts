import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CommonApiQueries } from 'src/Common/api.decorator';
import { ApiQuery } from '@nestjs/swagger';
import { RoleUser } from '@prisma/client';
import { BaseSearchDto } from 'src/Common/query.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @CommonApiQueries()
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt', 'fullname'],
  })
  @ApiQuery({ name: 'isActive', required: false, enum: ['true', 'false'] })
  @ApiQuery({ name: 'phone', required: false, type: String })
  @ApiQuery({ name: 'fullname', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, enum: RoleUser })
  findAll(@Query() dto: BaseSearchDto) {
    return this.userService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
