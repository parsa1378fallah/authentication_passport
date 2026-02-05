import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'argon2';
import { verify } from 'argon2';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly UserEntity: Repository<User>) { }
  async create(user: CreateUserDto) {
    const { password, ...other } = user;
    const hashedPassword = await hash(password);
    const newUser = this.UserEntity.create({ password: hashedPassword, ...other });
    await this.UserEntity.save(newUser)
  }
  async findByEmail(email: string, withPassword = false) {
    const query = this.UserEntity.createQueryBuilder('user')
      .where('user.email = :email', { email });

    if (withPassword) {
      query.addSelect('user.password');
    }

    const user = await query.getOne();

    if (!user) {
      throw new NotFoundException('the user by this email did not exist');
    }

    return user;
  }
  async findOne(id: number, withPassword = false) {
    const query = this.UserEntity.createQueryBuilder('user')
      .where('user.id = :id', { id });

    if (withPassword) {
      query.addSelect('user.password');
    }

    const user = await query.getOne();

    if (!user) {
      throw new NotFoundException('the user by this id did not exist');
    }

    return user;
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.findByEmail(email, true);
    if (!user) throw new UnauthorizedException('user not found!');
    const isPasswordMatched = await verify(user.password, password)
    if (!isPasswordMatched) throw new UnauthorizedException('Invalid Credentials!')
    return { id: user.id, firstName: user.firstName, lastName: user.lastName  , role : user.role}
  }

  async updateHashedRefreshToken(
    userId: number,
    hashedRefreshToken: string | null
  ): Promise<void> {

    const user = await this.UserEntity.findOne({
      where: { id: String(userId) }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.UserEntity.update(
      { id: String(userId) },
      { hashedRefreshToken }
    );
  }

  findAll() {
    return `This action returns all user`;
  }


  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
