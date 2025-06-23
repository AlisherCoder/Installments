import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) {}

  async create(createRegionDto: CreateRegionDto) {
    const { name } = createRegionDto;
    try {
      const region = await this.prisma.region.findFirst({ where: { name } });

      if (region && !region.isDeleted) {
        throw new ConflictException('A region with this name already exists');
      }

      if (region && region.isDeleted) {
        const data = await this.prisma.region.update({
          where: { name },
          data: { isDeleted: false },
        });

        return { data };
      }

      const data = await this.prisma.region.create({ data: createRegionDto });

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.region.findMany({
        select: { id: true, name: true },
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.prisma.region.findUnique({
        where: { id },
      });

      if (!data) {
        throw new NotFoundException('Not found region');
      }

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const data = await this.prisma.region.delete({ where: { id } });

      if (!data) {
        throw new NotFoundException('Not found region');
      }

      return { data };
    } catch (error) {
      throw error;
    }
  }
}
