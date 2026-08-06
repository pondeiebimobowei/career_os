import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

describe('ProfileController', () => {
  let controller: ProfileController;

  const mockProfileService = {
    getProfile: jest
      .fn()
      .mockResolvedValue({ id: 'u123', fullName: 'Test User' }),
    upsertProfile: jest
      .fn()
      .mockResolvedValue({ id: 'p123', targetRole: 'Senior Engineer' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [{ provide: ProfileService, useValue: mockProfileService }],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get profile', async () => {
    const res = await controller.getProfile('u123');
    expect(res.success).toBe(true);
    expect(res.data.id).toBe('u123');
  });

  it('should update profile', async () => {
    const res = await controller.updateProfile('u123', {
      targetRole: 'Senior Engineer',
    });
    expect(res.success).toBe(true);
    expect(res.data.targetRole).toBe('Senior Engineer');
  });
});
