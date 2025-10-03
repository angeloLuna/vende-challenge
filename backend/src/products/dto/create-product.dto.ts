import { IsUUID, IsNotEmpty, IsString, IsNumber, Min, Matches } from 'class-validator';

export class CreateProductDto {
  @IsString() @IsNotEmpty()
  name: string;

  @IsString() @Matches(/^[A-Z0-9\-]{2,32}$/)
  sku: string;

  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
  price: number;

  @IsUUID()
  companyId: string;
}
