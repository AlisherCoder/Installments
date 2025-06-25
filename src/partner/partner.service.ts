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

      const region = await this.prisma.region.findUnique({
        where: { id: regionId, isDeleted: false },
      });

      if (!region) {
        throw new NotFoundException('Not found region or region is deleted');
      }

      const data = await this.prisma.partner.create({
        data: { ...createPartnerDto, userId: user.id },
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.partner.findMany();
      const total = await this.prisma.partner.count();

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

      const data = await this.prisma.partner.update({
        where: { id },
        data: updatePartnerDto,
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
