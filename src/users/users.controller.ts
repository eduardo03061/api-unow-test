import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('/login')
  login(@Body() createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    return this.usersService.loginUser(email, password);
  }

  @Post('/refresh')
  refreshToken(@Req() request: Request) {
    const [type, token] = request.headers['authorization'].split(' ') || [];
    return this.usersService.refreshToken(token);
  }

  @Get('/metrics')
  async metrics(@Res() res) {
    const employeeMetrics = await this.usersService.metrics();

    res.send(employeeMetrics);
  }

  @Get()
  async findAll(@Res() res, @Query() query) {
    const employee = await this.usersService.findAll(query);
    
    res.send(employee);
  }
 
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('/forgot-password')
  forgotPassword(@Body() body) {
    console.log('entraa');
    
    return this.usersService.forgotPassword(body);
  }
}
