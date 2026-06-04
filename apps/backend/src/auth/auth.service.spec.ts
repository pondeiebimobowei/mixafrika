import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { Setting } from 'src/database/models/setting.model';
import { Business } from 'src/database/models/business.model';
import { User } from 'src/database/models/user.model';
import { Wallet } from 'src/database/models/wallet.model';
import { BusinessUser } from 'src/database/models/business-user';
import { Branch } from 'src/database/models/branch.model';
import { BranchUser } from 'src/database/models/branch-user';
import { Collection } from 'src/database/models/collection.model';
import { TenantAccessService } from 'src/access/tenant-access.service';
import { Op } from 'sequelize';

describe('AuthService', () => {
  let service: AuthService;
  let tenantAccessService: jest.Mocked<TenantAccessService>;
  let syncService: jest.Mocked<any>;

  beforeEach(() => {
    tenantAccessService = {
      getAccessibleBusinessIds: jest.fn(),
      getAccessibleBranchIds: jest.fn(),
    } as unknown as jest.Mocked<TenantAccessService>;

    syncService = {
      pullChanges: jest.fn().mockResolvedValue({
        global_products: [],
        products: [],
        inventory: [],
        batches: [],
        product_category: [],
        stock_movements: [],
        customers: [],
        sales: [],
        sales_items: [],
        payments: [],
        stock_transfers: [],
        stock_transfer_items: [],
      }),
    } as unknown as jest.Mocked<any>;

    service = new AuthService(
      {
        get: jest.fn((key: string) =>
          key === 'access_token_secret' ? 'access-secret' : 'refresh-secret',
        ),
      } as unknown as ConfigService,
      tenantAccessService,
      syncService,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('removes password hashes from signup responses', async () => {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);
    jest.spyOn(User, 'create').mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      get: () => ({
        id: 'user-1',
        email: 'user@example.com',
        password: 'hashed-password',
      }),
    } as any);
    jest.spyOn(Wallet, 'create').mockResolvedValue({} as any);
    jest.spyOn(Setting, 'create').mockResolvedValue({} as any);

    const response = await service.handleSignup({
      first_name: 'Ada',
      last_name: 'Lovelace',
      email: 'user@example.com',
      password: 'password123',
      role: 'trader',
    } as any);

    expect(response.data.user).toEqual({
      id: 'user-1',
      email: 'user@example.com',
    });
  });

  it('scopes sync data to the authenticated user tenant graph', async () => {
    tenantAccessService.getAccessibleBusinessIds.mockResolvedValue(['business-1']);
    tenantAccessService.getAccessibleBranchIds.mockResolvedValue(['branch-1']);
    jest.spyOn(User, 'findOne').mockResolvedValue({
      id: 'user-1',
      get: () => ({ id: 'user-1', email: 'user@example.com', password: 'secret' }),
    } as any);
    jest.spyOn(BusinessUser, 'findAll').mockResolvedValue([{ business_id: 'business-1' }] as any);
    jest.spyOn(BranchUser, 'findAll').mockResolvedValue([{ branch_id: 'branch-1' }] as any);
    const businessFindAll = jest
      .spyOn(Business, 'findAll')
      .mockResolvedValue([{ id: 'business-1' }] as any);
    const branchFindAll = jest.spyOn(Branch, 'findAll').mockResolvedValue([
      { id: 'branch-1', collection_id: 'collection-1' },
    ] as any);
    jest.spyOn(Collection, 'findAll').mockResolvedValue([{ id: 'collection-1' }] as any);

    const response = await service.handleSync('user-1');

    expect(businessFindAll).toHaveBeenCalledWith({
      where: { id: { [Op.in]: ['business-1'] } },
    });
    expect(branchFindAll).toHaveBeenCalledWith({
      where: { id: { [Op.in]: ['branch-1'] } },
    });
    expect(response.data.user).toEqual({
      id: 'user-1',
      email: 'user@example.com',
    });
  });
});
