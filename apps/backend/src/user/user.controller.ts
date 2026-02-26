import { Body, Controller, Get, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/database/models/user.model';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ZodPipe } from 'src/pipes/zod-pipes';
import { Verify_identity, verify_identity } from '@shared/shared/src/validation/verify-identity-dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('v1/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Get('')
  getUserProfile(@ParsedToken() user: User) {
    return this.userService.handleGetUserProfile(user.id);
  }

  @Patch('')
  updateUserProfile() {
    return this.userService.handleUpdateUserProfile();
  }

  @Get('credit-score')
  getUserCreditScore() {
    return this.userService.handleGetCreditScore();
  }

  @Post('verify-identity')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'id_image_front', maxCount: 1 },
    { name: 'id_image_back', maxCount: 1 },
  ]))
  async verifyIdentity(
    @ParsedToken() user: User,
    @Body(new ZodPipe(verify_identity)) body: Verify_identity,
    @UploadedFiles() files: { id_image_front: Express.Multer.File[], id_image_back: Express.Multer.File[] },
  ) {
    let id_image_front_url = '';
    let id_image_back_url = '';
    const id_image_front = files.id_image_front ? files.id_image_front[0].path : null;
    const id_image_back = files.id_image_back ? files.id_image_back[0].path : null;

    if (id_image_front) {
      const result = await this.cloudinaryService.uploadFile(id_image_front);
      id_image_front_url = result.secure_url;
    }

    if (id_image_back) {
      const result = await this.cloudinaryService.uploadFile(id_image_back);
      id_image_back_url = result.secure_url;
    }

    return this.userService.handleVerifyIdentity(user.id, {
      ...body,
      id_image_front: id_image_front_url,
      id_image_back: id_image_back_url,

    });
  }
}
