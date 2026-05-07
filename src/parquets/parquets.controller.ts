import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParquetsService } from './parquets.service';
import { CreateParquetDto } from './dto/create-parquet.dto';
import { UpdateParquetDto } from './dto/update-parquet.dto';

@Controller('parquets')
export class ParquetsController {
  constructor(private readonly parquetsService: ParquetsService) {}

  @Post()
  create(@Body() createParquetDto: CreateParquetDto) {
    return this.parquetsService.create(createParquetDto);
  }

  @Get()
  findAll() {
    return this.parquetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parquetsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParquetDto: UpdateParquetDto) {
    return this.parquetsService.update(+id, updateParquetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parquetsService.remove(+id);
  }
}
