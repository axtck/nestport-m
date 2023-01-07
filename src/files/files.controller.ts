import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/decorators/user.decorator';
import { Id } from 'src/types/core.types';
import { generateUniqueIdentifier } from 'src/utils/crypto-utils';
import { IUserProfileImage } from './interfaces/models/UserProfileImage';
import { UserProfileImagesService } from './user-profile-images.service';

@Controller('files')
export class FilesController {
  constructor(private readonly userProfileImagesService: UserProfileImagesService) {}

  @Get('user/:userId/images/profile')
  public async findAllUserProfileImages(@Param('userId', ParseIntPipe) userId: Id): Promise<IUserProfileImage[]> {
    return this.userProfileImagesService.findAllByUserId(userId);
  }

  @Get('user/images/profile/:id')
  public async findOneUserProfileImage(@Res() res: Response, @Param('id', ParseIntPipe) id: Id): Promise<void> {
    const image: IUserProfileImage = await this.userProfileImagesService.findOne(id);
    res.sendFile(path.join(__dirname, '..', '..', image.filePath));
  }

  @UseGuards(JwtAuthGuard)
  @Post('user/images/profile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/images/user/profile',
        filename: (_req, file, cb) => {
          // TODO: maybe write logic to only accept files from specific mime types
          cb(null, `${generateUniqueIdentifier()}${path.extname(file.originalname)}`);
        },
      }),
    }),
  )
  public async uploadUserProfileImage(@User('id') id: Id, @UploadedFile() file: Express.Multer.File): Promise<void> {
    await this.userProfileImagesService.create(id, file.path);
  }
}
