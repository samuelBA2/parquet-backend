import { PartialType } from '@nestjs/mapped-types';
import { CreateParquetDto } from './create-parquet.dto';

export class UpdateParquetDto extends PartialType(CreateParquetDto) {}
