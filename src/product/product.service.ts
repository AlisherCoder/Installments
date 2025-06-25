import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, req: Request) {
    const { categoryId } = createProductDto;
    const user = req['user'];
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId, isDeleted: false },
      });

      if (!category) {
        throw new NotFoundException(
          'Not found category or category is deleted',
        );
      }

      const data = await this.prisma.product.create({
        data: { ...createProductDto, userId: user.id },
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.product.findMany({
        include: { category: true },
      });

      const total = await this.prisma.product.count();

      return { data, total };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.prisma.product.findUnique({ where: { id } });

      if (!data) {
        throw new NotFoundException('Not found product');
      }

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { categoryId, image } = updateProductDto;
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });

      if (!product) {
        throw new NotFoundException('Not found product');
      }

      if (categoryId) {
        const category = await this.prisma.category.findUnique({
          where: { id: categoryId },
        });

        if (!category) {
          throw new NotFoundException('Not found category');
        }
      }

      const data = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
    } catch (error) {
      throw error;
    }
  }
}
