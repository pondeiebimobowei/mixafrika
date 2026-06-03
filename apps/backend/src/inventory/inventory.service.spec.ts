import { BadRequestException } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { TenantAccessService } from 'src/access/tenant-access.service';

describe('InventoryService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('rejects creating inventory without a branch scope', async () => {
    const service = new InventoryService({
      assertBranchAccess: jest.fn(),
    } as unknown as TenantAccessService);

    await expect(service.create('user-1', { quantity: 4 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
