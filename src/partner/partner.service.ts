import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { BaseSearchDto } from 'src/Common/query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PartnerService {
  constructor(private prisma: PrismaService) {}

  async create(createPartnerDto: CreatePartnerDto, req: Request) {
    const { phone, regionId } = createPartnerDto;
    const user = req['user'];
    try {
      const partner = await this.prisma.partner.findUnique({
        where: { phone },
      });

      if (partner) {
        throw new ConflictException('Partner already exists with phone number');
      }

      if (regionId) {
        const region = await this.prisma.region.findUnique({
          where: { id: regionId, isDeleted: false },
        });

        if (!region) {
          throw new NotFoundException('Not found region or region is deleted');
        }
      }

      const data = await this.prisma.partner.create({
        data: {
          ...createPartnerDto,
          userId: user.id,
          location: {} as Prisma.InputJsonValue,
        },
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async findAll(dto: BaseSearchDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'balance',
      orderBy = 'asc',
      isActive = true,
      isArchive = false,
      // role = 'CUSTOMER',
      search,
    } = dto;

    let query: any = {};

    if (isActive === 'true') query.isActive = true;
    if (isActive === 'false') query.isActive = false;
    if (isArchive === 'true') query.isArchive = true;
    if (isArchive === 'false') query.isArchive = false;

    if (search) {
      const trimmed = search.trim();
      query.OR = [
        {
          fullname: {
            contains: trimmed,
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: trimmed,
            mode: 'insensitive',
          },
        },
      ];
    }

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.partner.findMany({
          where: query,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            [sortBy]: orderBy,
          },
          include: { region: true },
        }),
        this.prisma.partner.count({ where: query }),
      ]);

      return { data, total };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.prisma.partner.findUnique({ where: { id } });

      if (!data) {
        throw new NotFoundException('Not found partner');
      }

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto) {
    const { phone, regionId } = updatePartnerDto;
    try {
      const partner = await this.prisma.partner.findUnique({ where: { id } });

      if (!partner) {
        throw new NotFoundException('Not found partner');
      }

      if (phone && partner.phone !== phone) {
        const findPhone = await this.prisma.partner.findUnique({
          where: { phone },
        });

        if (findPhone) {
          throw new ConflictException(
            'Partner already exists with phone number',
          );
        }
      }

      if (regionId) {
        const region = await this.prisma.region.findUnique({
          where: { id: regionId, isDeleted: false },
        });

        if (!region) {
          throw new NotFoundException('Not found region or region is deleted');
        }
      }

      const cleanDto = Object.fromEntries(
        Object.entries(updatePartnerDto).filter(([_, v]) => v !== undefined),
      );

      const data = await this.prisma.partner.update({
        where: { id },
        data: cleanDto,
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const partner = await this.prisma.partner.findUnique({
        where: { id },
      });

      if (!partner) {
        throw new NotFoundException('Partner not found');
      }

      if (!partner.isActive) {
        throw new BadRequestException('Partner already is not active');
      }

      const data = await this.prisma.partner.update({
        where: { id },
        data: { isActive: false },
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }
}
