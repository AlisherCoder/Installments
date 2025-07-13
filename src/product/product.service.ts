import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { PurchaseService } from 'src/purchase/purchase.service';
import { BaseSearchDto } from 'src/Common/query.dto';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private purchaseService: PurchaseService,
  ) { }

  async create(createProductDto: CreateProductDto, req: Request) {
    const { partnerId, ...body } = createProductDto;
    const user = req['user'];

    try {
      const product = await this.prisma.product.findUnique({ where: { name: body.name } })

      if (product) {
        throw new ConflictException('Product is already exists with name');
      }

      const category = await this.prisma.category.findUnique({
        where: { id: body.categoryId, isDeleted: false },
      });

      if (!category) {
        throw new NotFoundException('Not found category or category is deleted');
      }

      const data = await this.prisma.product.create({
        data: { ...body, userId: user.id, totalPrice: 0, quantity: 0 },
      });

      const purchase = await this.purchaseService.create(
        {
          partnerId,
          productId: data.id,
          quantity: body.quantity,
          totalPrice: body.totalPrice,
        },
        req,
      );

      return { data, purchase };
    } catch (error) {
      throw error;
    }
  }

  async findAll(dto: BaseSearchDto) {
    const {
      page = 1,
      limit = 10,
      orderBy = 'desc',
      sortBy = 'createdAt',
      categoryId,
      userId,
      search,
    } = dto;

    const query: any = { isDeleted: false };

    if (search) {
      const trimmed = search.trim();
      query.name = {
        contains: trimmed,
        mode: 'insensitive',
      };
    }

    if (userId) query.userId = userId;
    if (categoryId) query.categoryId = categoryId;

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.product.findMany({
          where: query,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: orderBy },
          include: { createdBy: { select: { id: true, fullname: true, phone: true } } },
        }),

        this.prisma.product.count({ where: query }),
      ]);

      return { data, total };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.prisma.product.findUnique({
        where: { id, isDeleted: false },
        include: {
          createdBy: { select: { id: true, fullname: true, phone: true } },
          Purchase: true,
        },
      });

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
      const product = await this.prisma.product.findUnique({
        where: { id, isDeleted: false },
      });

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

      if (data && image && product.image) {
        this.deleteUploadedFile(product.image);
      }

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id, isDeleted: false },
      });

      if (!product) {
        throw new NotFoundException('Not found product');
      }

      const data = await this.prisma.product.update({
        where: { id },
        data: { isDeleted: true },
      });

      if (data && product.image) {
        this.deleteUploadedFile(product.image);
      }

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async deleteUploadedFile(filename: string) {
    const filePath = join(process.cwd(), 'uploads', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Fayl o'chirildi: ${filePath}`);
    } else {
      console.warn(`⚠️ Fayl topilmadi: ${filePath}`);
    }
  }
}
