import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';

@Controller('api/v1/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':userId')
  async getProfile(@Param('userId') userId: string) {
    const data = await this.profileService.getProfile(userId);
    return { success: true, data };
  }

  @Post(':userId')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Param('userId') userId: string,
    @Body() dto: CreateProfileDto,
  ) {
    const data = await this.profileService.upsertProfile(userId, dto);
    return { success: true, data };
  }
}
