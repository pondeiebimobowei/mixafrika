import { ForbiddenException, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { TenantAccessService } from 'src/access/tenant-access.service';
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
import {
  SyncAck,
  SyncChanges,
  SyncConflict,
  SyncEntity,
  SyncFailure,
  SyncMutation,
  SyncRequest,
} from './sync.types';
import { ProductCategory } from 'src/database/models/product-category';

type SyncModel = typeof Product;

const syncOrder: SyncEntity[] = [
  'user',
  'businesses',
  'collections',
  'business_users',
  'branches',
  'branch_users',
  'product_category',
  'global_products',
  'products',
  'customers',
  'inventory',
  'batches',
  'stock_movements',
  'sales',
  'sales_items',
  'payments',
  'stock_transfers',
  'stock_transfer_items',
];

const serverManagedEntities = new Set<SyncEntity>([
  'user',
  'businesses',
  'collections',
  'business_users',
  'branches',
  'branch_users',
]);

const entityModels: Record<SyncEntity, SyncModel> = {
  user: User as unknown as SyncModel,
  businesses: Business as unknown as SyncModel,
  collections: Collection as unknown as SyncModel,
  business_users: BusinessUser as unknown as SyncModel,
  branches: Branch as unknown as SyncModel,
  branch_users: BranchUser as unknown as SyncModel,
  global_products: GlobalProduct as unknown as SyncModel,
  products: Product,
  product_category: ProductCategory as unknown as SyncModel,
  inventory: Inventory as unknown as SyncModel,
  batches: Batch as unknown as SyncModel,
  stock_movements: StockMovement as unknown as SyncModel,
  customers: Customer as unknown as SyncModel,
  sales: Sales as unknown as SyncModel,
  sales_items: SalesItem as unknown as SyncModel,
  payments: Payment as unknown as SyncModel,
  stock_transfers: StockTransfer as unknown as SyncModel,
  stock_transfer_items: StockTransferItem as unknown as SyncModel,
};

const camelToSnake: Record<string, string> = {
  syncStatus: 'sync_status',
  syncDate: 'sync_date',
  userName: 'user_name',
  firstName: 'first_name',
  lastName: 'last_name',
  isEmailVerified: 'is_email_verified',
  isVerified: 'is_verified',
  creditScore: 'credit_score',
  creditScoreStatus: 'credit_score_status',
  streetAddress: 'street_address',
  isHeadOffice: 'is_head_office',
  businessId: 'business_id',
  collectionId: 'collection_id',
  userId: 'user_id',
  isActive: 'is_active',
  hasFullAccess: 'has_full_access',
  joinedAt: 'joined_at',
  assignedAt: 'assigned_at',
  totalTraders: 'total_traders',
  coverImage: 'cover_image',
  minInvestment: 'min_investment',
  bulkUnitName: 'bulk_unit_name',
  pieceUnitName: 'piece_unit_name',
  unitsPerBulk: 'units_per_bulk',
  costPricePerUnit: 'cost_price_per_unit',
  sellingPricePerPiece: 'selling_price_per_piece',
  sellingPricePerBulk: 'selling_price_per_bulk',
  imageUrl: 'image_url',
  branchId: 'branch_id',
  globalProductId: 'global_product_id',
  productCategoryId: 'product_category_id',
  normalizedName: 'normalized_name',
  productId: 'product_id',
  batchId: 'batch_id',
  saleId: 'sale_id',
  customerId: 'customer_id',
  amountPaid: 'amount_paid',
  paymentMethod: 'payment_method',
  unitPrice: 'unit_price',
  costPrice: 'cost_price',
  fromBranchId: 'from_branch_id',
  toBranchId: 'to_branch_id',
  transferId: 'transfer_id',
  referenceId: 'reference_id',
  createdById: 'created_by_id',
  initialQuantity: 'initial_quantity',
  remainingQuantity: 'remaining_quantity',
  batchNumber: 'batch_number',
  expiryDate: 'expiry_date',
};

const snakeToCamel = Object.entries(camelToSnake).reduce(
  (acc, [camel, snake]) => ({ ...acc, [snake]: camel }),
  {} as Record<string, string>,
);

const numericClientKeys = new Set([
  'amount',
  'amountPaid',
  'balance',
  'costPrice',
  'costPricePerUnit',
  'creditScore',
  'initialQuantity',
  'minInvestment',
  'quantity',
  'remainingQuantity',
  'roi',
  'sellingPricePerBulk',
  'sellingPricePerPiece',
  'totalAmount',
  'totalTraders',
  'unitPrice',
  'unitsPerBulk',
]);

const dateClientKeys = new Set([
  'assignedAt',
  'createdAt',
  'deletedAt',
  'expiryDate',
  'joinedAt',
  'reviewedAt',
  'syncDate',
  'updatedAt',
]);

@Injectable()
export class SyncService {
  constructor(private readonly tenantAccessService: TenantAccessService) {}

  async runSync(userId: string, request: SyncRequest) {
    const serverTime = new Date();
    const mutations = [...(request.mutations ?? [])].sort(
      (a, b) => syncOrder.indexOf(a.entity) - syncOrder.indexOf(b.entity),
    );

    const applied: SyncAck[] = [];
    const conflicts: SyncConflict[] = [];
    const failures: SyncFailure[] = [];

    for (const mutation of mutations) {
      try {
        const result = await this.applyMutation(userId, mutation, serverTime);

        if ('reason' in result) {
          conflicts.push(result);
        } else {
          applied.push(result);
        }
      } catch (error: any) {
        failures.push({
          entity: mutation.entity,
          localId: this.getMutationId(mutation),
          reason: error?.message ?? 'Unable to apply sync mutation',
        });
      }
    }

    const changes = await this.pullChanges(userId, request.cursor);

    return {
      success: true,
      message: 'Sync completed',
      data: {
        cursor: serverTime.toISOString(),
        serverTime: serverTime.toISOString(),
        applied,
        conflicts,
        failures,
        changes,
      },
    };
  }

  private async applyMutation(
    userId: string,
    mutation: SyncMutation,
    serverTime: Date,
  ): Promise<SyncAck | SyncConflict> {
    const model = entityModels[mutation.entity];
    if (!model) {
      throw new Error(`Unsupported sync entity: ${mutation.entity}`);
    }

    if (serverManagedEntities.has(mutation.entity)) {
      throw new Error(`Sync entity is server-managed: ${mutation.entity}`);
    }

    const data = this.normalizeIncomingRecord(mutation.data);
    const id = String(data.id ?? mutation.localId ?? mutation.local_id);

    if (!id) {
      throw new Error('Sync mutation is missing an id');
    }

    data.id = id;
    data.sync_status = 'completed';
    data.sync_date = serverTime.toISOString();

    await this.assertMutationAccess(userId, mutation.entity, data);

    const existing = await (model as any).findByPk(id, { paranoid: false });
    const clientUpdatedAt = this.toDate(data.updatedAt ?? data.updated_at);
    const serverUpdatedAt = this.toDate(existing?.updatedAt);

    if (
      existing &&
      clientUpdatedAt &&
      serverUpdatedAt &&
      serverUpdatedAt > clientUpdatedAt &&
      mutation.action !== 'delete'
    ) {
      return {
        entity: mutation.entity,
        localId: this.getMutationId(mutation),
        reason: 'server_newer',
        serverRecord: this.toClientRecord(existing),
      };
    }

    if (mutation.action === 'delete') {
      data.deletedAt = data.deletedAt ?? serverTime;
    }

    await (model as any).upsert(data);

    return {
      entity: mutation.entity,
      localId: this.getMutationId(mutation),
      serverId: id,
      status: 'completed',
      serverUpdatedAt: serverTime.toISOString(),
    };
  }

  public async pullChanges(
    userId: string,
    cursor?: string | null,
  ): Promise<SyncChanges> {
    const [businessIds, branchIds] = await Promise.all([
      this.tenantAccessService.getAccessibleBusinessIds(userId),
      this.tenantAccessService.getAccessibleBranchIds(userId),
    ]);
    const since = this.toDate(cursor);
    const updatedSince = since ? { updatedAt: { [Op.gt]: since } } : {};
    const empty = this.emptyChanges();

    if (businessIds.length === 0 && branchIds.length === 0) {
      return empty;
    }

    const [user, businesses, businessUsers, branchUsers, accessibleBranches] =
      await Promise.all([
        User.findByPk(userId, { paranoid: false }),
        businessIds.length > 0
          ? Business.findAll({
              where: { ...updatedSince, id: { [Op.in]: businessIds } },
              paranoid: false,
            })
          : [],
        BusinessUser.findAll({
          where: { ...updatedSince, user_id: userId },
          paranoid: false,
        }),
        
        BranchUser.findAll({
          where: { ...updatedSince, user_id: userId },
          paranoid: false,
        }),
        branchIds.length > 0
          ? Branch.findAll({
              where: { id: { [Op.in]: branchIds } },
              attributes: ['id', 'collection_id'],
              paranoid: false,
            })
          : [],
      ]);

    const collectionIds = accessibleBranches
      .map((branch) => branch.collection_id)
      .filter(Boolean);

    const [branches, collections, accessibleProducts, accessibleSales, accessibleTransfers] =
      await Promise.all([
        branchIds.length > 0
          ? Branch.findAll({
              where: { ...updatedSince, id: { [Op.in]: branchIds } },
              paranoid: false,
            })
          : [],
        collectionIds.length > 0
          ? Collection.findAll({
              where: { ...updatedSince, id: { [Op.in]: collectionIds } },
              paranoid: false,
            })
          : [],
        Product.findAll({
          where: { branch_id: { [Op.in]: branchIds } },
          attributes: ['id', 'global_product_id'],
          paranoid: false,
        }),
        Sales.findAll({
          where: { branch_id: { [Op.in]: branchIds } },
          attributes: ['id'],
          paranoid: false,
        }),
        StockTransfer.findAll({
          where: {
            [Op.or]: [
              { from_branch_id: { [Op.in]: branchIds } },
              { to_branch_id: { [Op.in]: branchIds } },
            ],
          },
          attributes: ['id'],
          paranoid: false,
        }),
      ]);

    const [
      products,
      inventory,
      batches,
      stockMovements,
      customers,
      sales,
      stockTransfers,
    ] = await Promise.all([
      Product.findAll({
        where: { ...updatedSince, branch_id: { [Op.in]: branchIds } },
        paranoid: false,
      }),
      Inventory.findAll({
        where: { ...updatedSince, branch_id: { [Op.in]: branchIds } },
        paranoid: false,
      }),
      Batch.findAll({
        where: { ...updatedSince, branch_id: { [Op.in]: branchIds } },
        paranoid: false,
      }),
      StockMovement.findAll({
        where: { ...updatedSince, branch_id: { [Op.in]: branchIds } },
        paranoid: false,
      }),
      Customer.findAll({
        where: { ...updatedSince, branch_id: { [Op.in]: branchIds } },
        paranoid: false,
      }),
      Sales.findAll({
        where: { ...updatedSince, branch_id: { [Op.in]: branchIds } },
        paranoid: false,
      }),
      StockTransfer.findAll({
        where: {
          ...updatedSince,
          [Op.or]: [
            { from_branch_id: { [Op.in]: branchIds } },
            { to_branch_id: { [Op.in]: branchIds } },
          ],
        },
        paranoid: false,
      }),
    ]);

    const saleIds = accessibleSales.map((sale) => sale.id);
    const transferIds = accessibleTransfers.map((transfer) => transfer.id);
    const globalProductIds = accessibleProducts
      .map((product) => product.global_product_id)
      .filter(Boolean);
    const changedProductGlobalIds = products
      .map((product) => product.global_product_id)
      .filter(Boolean);
    const globalProductWhere =
      since && changedProductGlobalIds.length > 0
        ? {
            id: { [Op.in]: globalProductIds },
            [Op.or]: [
              updatedSince,
              { id: { [Op.in]: changedProductGlobalIds } },
            ],
          }
        : {
            ...updatedSince,
            id: { [Op.in]: globalProductIds },
          };

    const [salesItems, payments, stockTransferItems, globalProducts] =
      await Promise.all([
        saleIds.length > 0
          ? SalesItem.findAll({
              where: {
                ...updatedSince,
                sale_id: { [Op.in]: saleIds },
              },
              paranoid: false,
            })
          : [],
        saleIds.length > 0
          ? Payment.findAll({
              where: {
                ...updatedSince,
                sale_id: { [Op.in]: saleIds },
              },
              paranoid: false,
            })
          : [],
        transferIds.length > 0
          ? StockTransferItem.findAll({
              where: {
                ...updatedSince,
                transfer_id: { [Op.in]: transferIds },
              },
              paranoid: false,
            })
          : [],
        globalProductIds.length > 0
          ? GlobalProduct.findAll({
              where: globalProductWhere,
              paranoid: false,
            })
          : [],
      ]);

    return {
      ...empty,
      user: user ? [this.toClientRecord(user)] : [],
      businesses: businesses.map((record) => this.toClientRecord(record)),
      collections: collections.map((record) => this.toClientRecord(record)),
      business_users: businessUsers.map((record) => this.toClientRecord(record)),
      branches: branches.map((record) => this.toClientRecord(record)),
      branch_users: branchUsers.map((record) => this.toClientRecord(record)),
      global_products: globalProducts.map((record) =>
        this.toClientRecord(record),
      ),
      products: products.map((record) => this.toClientRecord(record)),
      inventory: inventory.map((record) => this.toClientRecord(record)),
      batches: batches.map((record) => this.toClientRecord(record)),
      stock_movements: stockMovements.map((record) =>
        this.toClientRecord(record),
      ),
      customers: customers.map((record) => this.toClientRecord(record)),
      sales: sales.map((record) => this.toClientRecord(record)),
      sales_items: salesItems.map((record) => this.toClientRecord(record)),
      payments: payments.map((record) => this.toClientRecord(record)),
      stock_transfers: stockTransfers.map((record) =>
        this.toClientRecord(record),
      ),
      stock_transfer_items: stockTransferItems.map((record) =>
        this.toClientRecord(record),
      ),
    };
  }

  private async assertMutationAccess(
    userId: string,
    entity: SyncEntity,
    data: Record<string, any>,
  ) {
    if (entity === 'global_products') {
      return;
    }

    if (data.branch_id) {
      await this.tenantAccessService.assertBranchAccess(userId, data.branch_id);
      return;
    }

    if (entity === 'sales_items' || entity === 'payments') {
      const sale = await Sales.findByPk(data.sale_id);
      if (!sale) throw new Error('Sale not found for sync mutation');
      await this.tenantAccessService.assertBranchAccess(userId, sale.branch_id);
      return;
    }

    if (entity === 'stock_transfers') {
      await this.tenantAccessService.assertBranchAccess(
        userId,
        data.from_branch_id,
      );
      await this.tenantAccessService.assertBranchAccess(
        userId,
        data.to_branch_id,
      );
      return;
    }

    if (entity === 'stock_transfer_items') {
      const transfer = await StockTransfer.findByPk(data.transfer_id);
      if (!transfer) throw new Error('Stock transfer not found for sync mutation');
      await this.tenantAccessService.assertBranchAccess(
        userId,
        transfer.from_branch_id,
      );
      await this.tenantAccessService.assertBranchAccess(
        userId,
        transfer.to_branch_id,
      );
      return;
    }

    throw new ForbiddenException('This sync mutation is not tenant scoped.');
  }

  private normalizeIncomingRecord(record: Record<string, unknown>) {
    return Object.entries(record).reduce(
      (normalized, [key, value]) => {
        if (value === undefined) {
          return normalized;
        }

        const normalizedKey = camelToSnake[key] ?? key;
        const clientKey = snakeToCamel[normalizedKey] ?? normalizedKey;

        if (numericClientKeys.has(clientKey)) {
          normalized[normalizedKey] = this.toNumber(value, clientKey);
          return normalized;
        }

        normalized[normalizedKey] = value;
        return normalized;
      },
      {} as Record<string, any>,
    );
  }

  private toClientRecord(record: any): Record<string, unknown> {
    const plain =
      typeof record.get === 'function' ? record.get({ plain: true }) : record;

    return Object.entries(plain).reduce(
      (clientRecord, [key, value]) => {
        if (key === 'password') {
          clientRecord.password = '';
          return clientRecord;
        }

        const clientKey = snakeToCamel[key] ?? key;
        if (dateClientKeys.has(clientKey)) {
          clientRecord[clientKey] = this.toClientDate(value, clientKey);
          return clientRecord;
        }

        if (numericClientKeys.has(clientKey)) {
          clientRecord[clientKey] = this.toNumber(value ?? 0, clientKey);
          return clientRecord;
        }

        clientRecord[clientKey] = value;
        return clientRecord;
      },
      {} as Record<string, unknown>,
    );
  }

  private getMutationId(mutation: SyncMutation) {
    return String(
      mutation.localId ??
        mutation.local_id ??
        mutation.data?.id ??
        'unknown',
    );
  }

  private toDate(value: unknown): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;

    const parsed = new Date(String(value));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private toNumber(value: unknown, field: string) {
    if (value === null) return value;
    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      throw new Error(`Invalid numeric value for ${field}`);
    }

    return numberValue;
  }

  private toClientDate(value: unknown, field: string) {
    if (value === null || value === undefined || value === '') {
      return value;
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    const parsed =
      typeof value === 'number' || /^\d+$/.test(String(value))
        ? new Date(Number(value))
        : new Date(String(value));

    if (Number.isNaN(parsed.getTime())) {
      throw new Error(`Invalid date value for ${field}`);
    }

    return parsed.toISOString();
  }

  private emptyChanges(): SyncChanges {
    return {
      user: [],
      businesses: [],
      collections: [],
      business_users: [],
      branches: [],
      branch_users: [],
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
    };
  }
}
