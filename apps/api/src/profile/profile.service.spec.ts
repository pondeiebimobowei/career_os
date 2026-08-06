import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { DatabaseService } from '../database/database.service';

describe('ProfileService', () => {
  let service: ProfileService;

  const mockDbService = {
    client: {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'u123',
          fullName: 'Test User',
          profile: { targetRole: 'Software Engineer' },
        }),
        upsert: jest.fn().mockResolvedValue({ id: 'u123' }),
      },
      careerProfile: {
        upsert: jest.fn().mockResolvedValue({
          id: 'p123',
          userId: 'u123',
          targetRole: 'Senior Engineer',
        }),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: DatabaseService, useValue: mockDbService },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user profile', async () => {
    const user = await service.getProfile('u123');
    expect(user.id).toBe('u123');
    expect(mockDbService.client.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'u123' },
      include: { profile: true },
    });
  });

  it('should upsert profile', async () => {
    const result = await service.upsertProfile('u123', {
      targetRole: 'Senior Engineer',
    });
    expect(result.targetRole).toBe('Senior Engineer');
    expect(mockDbService.client.careerProfile.upsert).toHaveBeenCalled();
  });
});
