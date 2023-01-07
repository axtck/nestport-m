import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/decorators/user.decorator';
import { Id } from 'src/types/core.types';
import { generateUniqueIdentifier } from 'src/utils/crypto-utils';
import { CreateUserDto } from './interfaces/dtos/create-user.dto';
import { IUser } from './interfaces/models/user';
import { UserImagesService } from './user-images.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService, private readonly userImagesService: UserImagesService) {}

  @Get('/')
  public async findAll(): Promise<IUser[]> {
    const users: IUser[] = await this.userService.findAll();
    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/info')
  public async findOne(@User('id') id: Id): Promise<IUser> {
    const user: IUser = await this.userService.findOne(id);
    return user;
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  public async create(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/')
  public async remove(@User('id') id: Id): Promise<void> {
    await this.userService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/images/profile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/images/user/profile',
        filename: (_req, file, cb) => {
          // TODO: maybe write logic to only accept files from specific mime types
          cb(null, `${generateUniqueIdentifier()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(@User('id') id: Id, @UploadedFile() file: Express.Multer.File): Promise<void> {
    await this.userImagesService.create(id, file.path);
  }
}
