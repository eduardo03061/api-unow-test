import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  workStation: string;

  @IsNotEmpty()
  @IsDate()
  dateOfBirth: string;

  @IsOptional()
  isActive: boolean;

  @IsOptional()
  createdAt: Date;

  @IsOptional()
  updatedAt: Date;
}
