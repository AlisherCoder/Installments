import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContractService {
  constructor(private prisma: PrismaService) {}

  async create(createContractDto: CreateContractDto) {
    const { partnerId } = createContractDto;
    try {
      const customer = await this.prisma.partner.findUnique({
        where: { id: partnerId, role: 'CUSTOMER' },
      });

      if (!customer) throw new NotFoundException('Not found customer');
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

  async update(id: string, updateContractDto: UpdateContractDto) {
    try {
    } catch (error) {
      throw error;
    }
  }
}
