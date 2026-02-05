import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsBoolean,
    IsMobilePhone,
    MinLength,
    MaxLength,
} from 'class-validator';
import { UserRole } from 'src/user/entities/user.entity';

export class CreateAuthDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(150)
    email: string;

    // @IsMobilePhone('fa-IR')
    // @IsNotEmpty()
    // @IsOptional()
    // mobile: string;

    @IsString()
    @MinLength(8)
    @MaxLength(64)
    password: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    avatar?: string;
}
