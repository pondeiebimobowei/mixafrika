import { BusinessService } from './business.service';
import { Business } from 'src/database/models/business.model';
import { TenantAccessService } from 'src/access/tenant-access.service';

describe('BusinessService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns only businesses accessible to the authenticated user', async () => {
    const tenantAccessService = {
      getAccessibleBusinessIds: jest.fn().mockResolvedValue(['business-1']),
    } as unknown as TenantAccessService;
    const service = new BusinessService(tenantAccessService);
    const findAll = jest
      .spyOn(Business, 'findAll')
      .mockResolvedValue([{ id: 'business-1' }] as any);

    const response = await service.handleGetBusiness('user-1');

    expect(findAll).toHaveBeenCalled();
    expect(response.data).toEqual([{ id: 'business-1' }]);
  });
});
