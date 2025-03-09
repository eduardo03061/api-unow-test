import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

type Tokens = {
  access_token: string;
  refresh_token: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtSvc: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const createdUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      const user = await createdUser.save();
      const { access_token, refresh_token } = await this.generateTokens(user);

      return {
        access_token,
        refresh_token,
        user: this.removePassword(user),
      };
    } catch (e) {
      console.log('E', e);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findAll(query) {
    const page = parseInt(query?.page, 10) || 1;
    const limit = parseInt(query?.limit, 10) || 5;
    const skip = (page - 1) * limit;
    const search = query?.search;

    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const [employees, total] = await Promise.all([
      this.userModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.userModel.countDocuments(filter),
    ]);

    return {
      employees,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async loginUser(email: string, password: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new HttpException(
          'Please check your credentials',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException(
          'Please check your credentials',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const { access_token, refresh_token } = await this.generateTokens(user);
      return { access_token, refresh_token, user: this.removePassword(user) };
    } catch (e) {
      console.log(e);

      throw new HttpException(
        'Please check your credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const user = await this.jwtSvc.verify(refreshToken, {
        secret: process.env.REFRESH_SECRET,
      });
      const payload = { email: user.email, sub: user.sub };
      const { access_token, refresh_token } =
        await this.generateTokens(payload);
      return {
        access_token,
        refresh_token,
        status: HttpStatus.OK,
        message: 'Token refreshed',
      };
    } catch {
      throw new HttpException('Refresh token failed', HttpStatus.UNAUTHORIZED);
    }
  }

  private async generateTokens(user): Promise<Tokens> {
    const jwtPayload = { email: user.email, sub: user._id };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtSvc.signAsync(jwtPayload, {
        secret: process.env.JWT_SECRET || 'unow',
        expiresIn: '5m',
      }),
      this.jwtSvc.signAsync(jwtPayload, {
        secret: process.env.REFRESH_SECRET || 'unowRefresh',
        expiresIn: '8h',
      }),
    ]);
    return { access_token, refresh_token };
  }

  private removePassword(user) {
    const { password, ...rest } = user.toObject();
    return rest;
  }

  async metrics() {
    const employeesActives = await this.userModel.countDocuments({
      isActive: true,
    });
    const employeesInactives = await this.userModel.countDocuments({
      isActive: false,
    });

    return { employeesActives, employeesInactives };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        {
          new: true,
        },
      );

      if (!updatedUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return this.removePassword(updatedUser);
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id);

      if (!deletedUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return { message: 'User successfully deleted' };
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async forgotPassword(body) {
    const { email, password } = body;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    //Desencriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await this.userModel.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      {
        new: true,
      },
    );
    return updatedUser;
  }
}
