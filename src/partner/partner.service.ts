import {
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
      const partner = await this.prisma.user.findUnique({ where: { phone } });

      if (partner) {
        throw new ConflictException('Partner already exists with phone number');
      }

      const region = await this.prisma.region.findUnique({
        where: { id: regionId, isDeleted: false },
      });

      if (!region) {
        throw new NotFoundException('Not found region');
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
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto) {
    try {
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
