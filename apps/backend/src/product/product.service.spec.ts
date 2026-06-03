import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from 'src/database/models/product.model';
import { TenantAccessService } from 'src/access/tenant-access.service';

describe('ProductService', () => {
  let tenantAccessService: jest.Mocked<TenantAccessService>;
  let service: ProductService;

  beforeEach(() => {
    tenantAccessService = {
      getAccessibleBranchIds: jest.fn(),
      assertBranchAccess: jest.fn(),
    } as unknown as jest.Mocked<TenantAccessService>;
    service = new ProductService(tenantAccessService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('rejects creating products without a branch scope', async () => {
    await expect(service.create('user-1', { name: 'Rice' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects reading products from an inaccessible branch', async () => {
    jest.spyOn(Product, 'findByPk').mockResolvedValue({
      id: 'product-1',
      branch_id: 'branch-2',
    } as any);
    tenantAccessService.assertBranchAccess.mockRejectedValue(new ForbiddenException());

    await expect(service.findOne('user-1', 'product-1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
