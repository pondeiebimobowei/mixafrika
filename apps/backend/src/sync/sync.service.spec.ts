import { TenantAccessService } from 'src/access/tenant-access.service';
import { Batch } from 'src/database/models/batch.model';
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
import { SyncService } from './sync.service';

describe('SyncService', () => {
  let service: SyncService;
  let tenantAccessService: jest.Mocked<TenantAccessService>;

  beforeEach(() => {
    tenantAccessService = {
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
    ]) {
      jest.spyOn(model, 'findAll').mockResolvedValue([] as any);
    }
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
      }),
    ]);
  });

  it('pulls only tenant-scoped product changes', async () => {
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
});
