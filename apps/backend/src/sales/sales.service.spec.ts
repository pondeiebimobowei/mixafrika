import { BadRequestException } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Sales } from 'src/database/models/sales.model';
import { TenantAccessService } from 'src/access/tenant-access.service';

describe('SalesService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('rejects creating sales without a branch scope', async () => {
    const service = new SalesService({
      assertBranchAccess: jest.fn(),
    } as unknown as TenantAccessService);

    await expect(service.create('user-1', { total_amount: 1000 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('records the authenticated user as the sale creator', async () => {
    const service = new SalesService({
      assertBranchAccess: jest.fn().mockResolvedValue(undefined),
    } as unknown as TenantAccessService);
    const create = jest.spyOn(Sales, 'create').mockResolvedValue({
      id: 'sale-1',
      created_by_id: 'user-1',
    } as any);

    await service.create('user-1', {
      branch_id: 'branch-1',
      total_amount: 1000,
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        branch_id: 'branch-1',
        created_by_id: 'user-1',
      }),
    );
  });
});
