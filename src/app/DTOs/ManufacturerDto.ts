import { ProductLineDto } from './ProductLineDto';

export interface ManufacturerDto {
  id?: number;
  manufacturerName: string;
  ctime?: string;
  mtime?: string;
  status?: number;
  productLineDtos?: ProductLineDto[];
}
