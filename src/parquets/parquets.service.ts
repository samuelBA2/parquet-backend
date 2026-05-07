import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateParquetDto } from './dto/create-parquet.dto';
import { UpdateParquetDto } from './dto/update-parquet.dto';

@Injectable()
export class ParquetsService {
  constructor(private prisma: PrismaService) {}

  create(createParquetDto: CreateParquetDto) {
    return 'This action adds a new parquet';
  }

  findAll() {
    return this.prisma.parquet.findMany({
      select:{id: true, nom: true},
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} parquet`;
  }

  update(id: number, updateParquetDto: UpdateParquetDto) {
    return `This action updates a #${id} parquet`;
  }

  remove(id: number) {
    return `This action removes a #${id} parquet`;
  }
}
