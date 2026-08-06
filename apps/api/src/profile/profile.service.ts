import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly db: DatabaseService) {}

  async getProfile(userId: string) {
    const user = await this.db.client.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async upsertProfile(userId: string, dto: CreateProfileDto) {
    const { fullName, timezone, ...profileData } = dto;

    if (fullName || timezone) {
      await this.db.client.user.update({
        where: { id: userId },
        data: {
          ...(fullName && { fullName }),
          ...(timezone && { timezone }),
        },
      });
    }

    const updatedProfile = await this.db.client.careerProfile.upsert({
      where: { userId },
      create: {
        userId,
        targetRole: profileData.targetRole,
        seniority: profileData.seniority,
        preferredLocations: profileData.preferredLocations || [],
        remotePreference: profileData.remotePreference,
        salaryExpectation: profileData.salaryExpectation,
        employmentTypes: profileData.employmentTypes || [],
      },
      update: {
        ...(profileData.targetRole && { targetRole: profileData.targetRole }),
        ...(profileData.seniority && { seniority: profileData.seniority }),
        ...(profileData.preferredLocations && {
          preferredLocations: profileData.preferredLocations,
        }),
        ...(profileData.remotePreference && {
          remotePreference: profileData.remotePreference,
        }),
        ...(profileData.salaryExpectation && {
          salaryExpectation: profileData.salaryExpectation,
        }),
        ...(profileData.employmentTypes && {
          employmentTypes: profileData.employmentTypes,
        }),
      },
    });

    return updatedProfile;
  }
}
