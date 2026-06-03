import { ForbiddenException } from '@nestjs/common';
import { Branch } from 'src/database/models/branch.model';
import { BranchUser } from 'src/database/models/branch-user';
import { BusinessUser } from 'src/database/models/business-user';
import { TenantAccessService } from './tenant-access.service';

describe('TenantAccessService', () => {
  let service: TenantAccessService;

  beforeEach(() => {
    service = new TenantAccessService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('collects accessible business ids from direct and branch membership', async () => {
    jest.spyOn(BusinessUser, 'findAll').mockResolvedValue([
      { business_id: 'business-1' } as any,
    ]);
    jest.spyOn(BranchUser, 'findAll').mockResolvedValue([
      { branch_id: 'branch-1' } as any,
    ]);
    jest.spyOn(Branch, 'findAll').mockResolvedValue([
      { business_id: 'business-2' } as any,
    ]);

    await expect(service.getAccessibleBusinessIds('user-1')).resolves.toEqual([
      'business-1',
      'business-2',
    ]);
  });

  it('denies management for members without elevated permissions', async () => {
    jest.spyOn(BusinessUser, 'findOne').mockResolvedValue({
      business_id: 'business-1',
      role: 'trader',
      has_full_access: false,
    } as any);

    await expect(
      service.assertBusinessManagement('user-1', 'business-1'),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
