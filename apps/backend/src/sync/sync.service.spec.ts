import { TenantAccessService } from 'src/access/tenant-access.service';
import { Op } from 'sequelize';
import { Batch } from 'src/database/models/batch.model';
import { Branch } from 'src/database/models/branch.model';
import { BranchUser } from 'src/database/models/branch-user';
import { BusinessUser } from 'src/database/models/business-user';
import { Business } from 'src/database/models/business.model';
import { Collection } from 'src/database/models/collection.model';
import { Customer } from 'src/database/models/customer';
import { GlobalProduct } from 'src/database/models/global-product';
import { Inventory } from 'src/database/models/inventory.model';
import { Payment } from 'src/database/models/payments';
import { Product } from 'src/database/models/product.model';
import { SalesItem } from 'src/database/models/sales-item.model';
import { Sales } from 'src/database/models/sales.model';
import { StockMovement } from 'src/database/models/stock-movement';
import { StockTransferItem } from 'src/database/models/stock-transfer-item';
import { StockTransfer } from 'src/database/models/stock-transfer.model';
import { User } from 'src/database/models/user.model';
import { SyncService } from './sync.service';

describe('SyncService', () => {
  let service: SyncService;
  let tenantAccessService: jest.Mocked<TenantAccessService>;

  beforeEach(() => {
    tenantAccessService = {
      getAccessibleBusinessIds: jest.fn().mockResolvedValue(['business-1']),
      getAccessibleBranchIds: jest.fn().mockResolvedValue(['branch-1']),
      assertBranchAccess: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<TenantAccessService>;

    service = new SyncService(tenantAccessService);

    for (const model of [
      Product,
      Inventory,
      Batch,
      StockMovement,
      Customer,
      Sales,
      SalesItem,
      Payment,
      StockTransfer,
      StockTransferItem,
      GlobalProduct,
      User,
      Business,
      BusinessUser,
      Branch,
      BranchUser,
      Collection,
    ]) {
      jest.spyOn(model, 'findAll').mockResolvedValue([] as any);
    }
    jest.spyOn(User, 'findByPk').mockResolvedValue({
      get: () => ({
        id: 'user-1',
        email: 'trader@mixafrika.com',
        password: 'hashed-password',
        first_name: 'Trader',
        last_name: 'One',
        role: 'trader',
        is_email_verified: true,
        is_verified: true,
        credit_score: '0',
        credit_score_status: 'not set',
        sync_status: 'completed',
        createdAt: new Date('2026-06-03T07:00:00.000Z'),
        updatedAt: new Date('2026-06-03T07:00:00.000Z'),
      }),
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('applies a branch-scoped mutation and returns an acknowledgement', async () => {
    jest.spyOn(Product, 'findByPk').mockResolvedValue(null);
    const upsert = jest.spyOn(Product, 'upsert').mockResolvedValue([{} as any, true]);

    const response = await service.runSync('user-1', {
      mutations: [
        {
          entity: 'products',
          localId: 'product-1',
          data: {
            id: 'product-1',
            branchId: 'branch-1',
            name: 'Rice',
            syncStatus: 'pending',
            updatedAt: '2026-06-03T08:00:00.000Z',
          },
        },
      ],
    });

    expect(tenantAccessService.assertBranchAccess).toHaveBeenCalledWith(
      'user-1',
      'branch-1',
    );
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'product-1',
        branch_id: 'branch-1',
        sync_status: 'completed',
      }),
    );
    expect(response.data.applied).toEqual([
      expect.objectContaining({
        entity: 'products',
        localId: 'product-1',
        serverId: 'product-1',
        serverUpdatedAt: expect.any(String),
      }),
    ]);
  });

  it('normalizes incoming numeric mutation fields before saving', async () => {
    jest.spyOn(Product, 'findByPk').mockResolvedValue(null);
    const upsert = jest.spyOn(Product, 'upsert').mockResolvedValue([{} as any, true]);

    const response = await service.runSync('user-1', {
      mutations: [
        {
          entity: 'products',
          localId: 'product-1',
          data: {
            id: 'product-1',
            branchId: 'branch-1',
            globalProductId: 'global-1',
            name: 'Rice',
            unitsPerBulk: '12',
            sellingPricePerPiece: '100',
            sellingPricePerBulk: '1100',
            syncStatus: 'pending',
            updatedAt: '2026-06-03T08:00:00.000Z',
          },
        },
      ],
    });

    expect(response.data.failures).toEqual([]);
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        units_per_bulk: 12,
        selling_price_per_piece: 100,
        selling_price_per_bulk: 1100,
      }),
    );
  });

  it('pulls only tenant-scoped product changes', async () => {
    jest.spyOn(Branch, 'findAll').mockResolvedValue([
      {
        id: 'branch-1',
        collection_id: null,
      },
    ] as any);
    jest.spyOn(Product, 'findAll').mockResolvedValue([
      {
        get: () => ({
          id: 'product-1',
          branch_id: 'branch-1',
          sync_status: 'completed',
        }),
        id: 'product-1',
        global_product_id: 'global-1',
      },
    ] as any);
    jest.spyOn(GlobalProduct, 'findAll').mockResolvedValue([
      {
        get: () => ({
          id: 'global-1',
          sync_status: 'completed',
        }),
      },
    ] as any);

    const response = await service.runSync('user-1', {
      cursor: '2026-06-03T07:00:00.000Z',
      mutations: [],
    });

    expect(Product.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        paranoid: false,
        where: expect.objectContaining({
          branch_id: expect.any(Object),
        }),
      }),
    );
    expect(response.data.changes.products).toEqual([
      {
        id: 'product-1',
        branchId: 'branch-1',
        syncStatus: 'completed',
      },
    ]);
  });

  it('serializes product numeric fields as numbers for the mobile database', async () => {
    jest.spyOn(Branch, 'findAll').mockResolvedValue([
      {
        id: 'branch-1',
        collection_id: null,
      },
    ] as any);
    jest.spyOn(Product, 'findAll').mockResolvedValue([
      {
        get: () => ({
          id: 'product-1',
          branch_id: 'branch-1',
          global_product_id: 'global-1',
          units_per_bulk: '12',
          cost_price_per_unit: '900',
          selling_price_per_piece: '100',
          selling_price_per_bulk: '1100',
          sync_status: 'completed',
        }),
        id: 'product-1',
        global_product_id: 'global-1',
      },
    ] as any);

    const response = await service.runSync('user-1', {
      cursor: null,
      mutations: [],
    });

    expect(response.data.changes.products).toEqual([
      expect.objectContaining({
        unitsPerBulk: 12,
        costPricePerUnit: 900,
        sellingPricePerPiece: 100,
        sellingPricePerBulk: 1100,
      }),
    ]);
  });

  it('serializes epoch date fields as ISO strings for the mobile database', async () => {
    jest.spyOn(Branch, 'findAll').mockResolvedValue([
      {
        id: 'branch-1',
        collection_id: null,
      },
    ] as any);
    jest.spyOn(Batch, 'findAll').mockResolvedValue([
      {
        get: () => ({
          id: 'batch-1',
          branch_id: 'branch-1',
          product_id: 'product-1',
          expiry_date: 1782777600000,
          batch_number: 'BATCH-1',
          cost_price_per_unit: 900,
          selling_price_per_piece: 100,
          selling_price_per_bulk: 1100,
          initial_quantity: 20,
          remaining_quantity: 10,
          sync_status: 'completed',
        }),
      },
    ] as any);

    const response = await service.runSync('user-1', {
      cursor: null,
      mutations: [],
    });

    expect(response.data.changes.batches).toEqual([
      expect.objectContaining({
        expiryDate: '2026-06-30T00:00:00.000Z',
      }),
    ]);
  });

  it('does not resend unchanged global products after the cursor', async () => {
    jest.spyOn(Branch, 'findAll').mockResolvedValue([
      {
        id: 'branch-1',
        collection_id: null,
      },
    ] as any);
    const productFindAll = jest.spyOn(Product, 'findAll');
    productFindAll.mockResolvedValueOnce([
      {
        get: () => ({
          id: 'product-1',
          branch_id: 'branch-1',
          global_product_id: 'global-1',
        }),
        id: 'product-1',
        global_product_id: 'global-1',
      },
    ] as any);
    productFindAll.mockResolvedValueOnce([] as any);
    const globalFindAll = jest
      .spyOn(GlobalProduct, 'findAll')
      .mockResolvedValue([]);

    await service.runSync('user-1', {
      cursor: '2026-06-03T07:00:00.000Z',
      mutations: [],
    });

    expect(globalFindAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          updatedAt: expect.any(Object),
          id: expect.any(Object),
        }),
      }),
    );
  });

  it('includes catalog parents for changed products even when the catalog row is older than the cursor', async () => {
    jest.spyOn(Branch, 'findAll').mockResolvedValue([
      {
        id: 'branch-1',
        collection_id: null,
      },
    ] as any);
    const productFindAll = jest.spyOn(Product, 'findAll');
    productFindAll.mockResolvedValueOnce([
      {
        get: () => ({
          id: 'product-1',
          branch_id: 'branch-1',
          global_product_id: 'global-1',
        }),
        id: 'product-1',
        global_product_id: 'global-1',
      },
    ] as any);
    productFindAll.mockResolvedValueOnce([
      {
        get: () => ({
          id: 'product-1',
          branch_id: 'branch-1',
          global_product_id: 'global-1',
        }),
        id: 'product-1',
        global_product_id: 'global-1',
      },
    ] as any);
    const globalFindAll = jest
      .spyOn(GlobalProduct, 'findAll')
      .mockResolvedValue([]);

    await service.runSync('user-1', {
      cursor: '2026-06-03T07:00:00.000Z',
      mutations: [],
    });

    const where = globalFindAll.mock.calls[0]?.[0]?.where as any;
    expect(where?.id).toEqual(expect.any(Object));
    expect(where?.[Op.or]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ updatedAt: expect.any(Object) }),
        expect.objectContaining({ id: expect.any(Object) }),
      ]),
    );
  });

  it('pulls tenant bootstrap records on first sync', async () => {
    jest.spyOn(Business, 'findAll').mockResolvedValue([
      {
        get: () => ({
          id: 'business-1',
          name: 'Trader Business',
          sync_status: 'completed',
        }),
      },
    ] as any);
    jest.spyOn(BusinessUser, 'findAll').mockResolvedValue([
      {
        get: () => ({
          id: 'business-user-1',
          user_id: 'user-1',
          business_id: 'business-1',
          role: 'admin',
          sync_status: 'completed',
        }),
      },
    ] as any);
    jest.spyOn(Branch, 'findAll').mockResolvedValue([
      {
        get: () => ({
          id: 'branch-1',
          business_id: 'business-1',
          name: 'Branch 1',
          sync_status: 'completed',
        }),
        id: 'branch-1',
        collection_id: null,
      },
    ] as any);

    const response = await service.runSync('user-1', {
      cursor: null,
      mutations: [],
    });

    expect(response.data.changes.user).toEqual([
      expect.objectContaining({
        id: 'user-1',
        email: 'trader@mixafrika.com',
        password: '',
      }),
    ]);
    expect(response.data.changes.businesses).toEqual([
      expect.objectContaining({ id: 'business-1' }),
    ]);
    expect(response.data.changes.branches).toEqual([
      expect.objectContaining({ id: 'branch-1', businessId: 'business-1' }),
    ]);
    expect(response.data.changes.business_users).toEqual([
      expect.objectContaining({
        id: 'business-user-1',
        userId: 'user-1',
        businessId: 'business-1',
      }),
    ]);
  });

  it('rejects client mutations for server-managed tenant bootstrap entities', async () => {
    const response = await service.runSync('user-1', {
      mutations: [
        {
          entity: 'branches',
          localId: 'branch-1',
          data: {
            id: 'branch-1',
            name: 'Forged Branch',
            businessId: 'business-1',
          },
        },
      ],
    });

    expect(response.data.applied).toEqual([]);
    expect(response.data.failures).toEqual([
      expect.objectContaining({
        entity: 'branches',
        localId: 'branch-1',
        reason: 'Sync entity is server-managed: branches',
      }),
    ]);
  });
});
