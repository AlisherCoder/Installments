import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    try {
      const category = await this.prisma.category.findUnique({
        where: { name },
      });

      if (category) {
        throw new ConflictException('Category already exists with name');
      }

      const data = await this.prisma.category.create({
        data: createCategoryDto,
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.category.findMany({
        select: { id: true, name: true, time: true },
        where: { isDeleted: false }
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { name } = updateCategoryDto;
    try {
      const category = await this.prisma.category.findUnique({
        where: { name },
      });

      if (category) {
        throw new ConflictException('Category already exists with name');
      }

      const data = await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });

      if (!data) {
        throw new NotFoundException('Not found category');
      }

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      if (category.isDeleted) {
        throw new BadRequestException('Category already is deleted');
      }

      const data = await this.prisma.category.update({
        where: { id },
        data: { isDeleted: true },
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }
}
