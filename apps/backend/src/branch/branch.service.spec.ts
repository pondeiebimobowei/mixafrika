import { BranchService } from './branch.service';
import { Branch } from 'src/database/models/branch.model';
import { TenantAccessService } from 'src/access/tenant-access.service';

describe('BranchService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns only accessible branches within the requested business', async () => {
    const tenantAccessService = {
      assertBusinessAccess: jest.fn().mockResolvedValue(undefined),
      getAccessibleBranchIds: jest.fn().mockResolvedValue(['branch-1']),
    } as unknown as TenantAccessService;
    const service = new BranchService(tenantAccessService);
    const findAll = jest
      .spyOn(Branch, 'findAll')
      .mockResolvedValue([{ id: 'branch-1', business_id: 'business-1' }] as any);

    const response = await service.handleGetUserBranches('user-1', 'business-1');

    expect(tenantAccessService.assertBusinessAccess).toHaveBeenCalledWith(
      'user-1',
      'business-1',
    );
    expect(findAll).toHaveBeenCalled();
    expect(response.data).toEqual([{ id: 'branch-1', business_id: 'business-1' }]);
  });
});
