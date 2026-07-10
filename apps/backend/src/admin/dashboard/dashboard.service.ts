import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { AdminOverview, AdminModerationAction, AdminBusinessPayload, AdminUserPayload } from '../admin.types';
import { User } from 'src/database/models/user.model';
import { Business } from 'src/database/models/business.model';
import { UserVerification } from 'src/database/models/user-verification';
import { BusinessVerification } from 'src/database/models/business-verification.model';
import { Branch } from 'src/database/models/branch.model';
import { Customer } from 'src/database/models/customer';
import { Collection } from 'src/database/models/collection.model';
import { BusinessUser } from 'src/database/models/business-user';
import { Wallet } from 'src/database/models/wallet.model';
import { Setting } from 'src/database/models/setting.model';
import { GlobalProduct } from 'src/database/models/global-product';
import { ProductCategory } from 'src/database/models/product-category';
import { Product } from 'src/database/models/product.model';
import { Batch } from 'src/database/models/batch.model';
import { Inventory } from 'src/database/models/inventory.model';
import { Sales } from 'src/database/models/sales.model';
import { SalesItem } from 'src/database/models/sales-item.model';
import { StockMovement } from 'src/database/models/stock-movement';
import { StockTransfer } from 'src/database/models/stock-transfer.model';
import { StockTransferItem } from 'src/database/models/stock-transfer-item';
import { Payment } from 'src/database/models/payments';
import { BranchUser } from 'src/database/models/branch-user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminDashboardService {
  async handleGetOverview(): Promise<{ success: boolean; message: string; data: AdminOverview }> {
    const [
      totalUsers,
      verifiedUsers,
      pendingUserVerifications,
      unverifiedUsers,
      totalBusinesses,
      verifiedBusinesses,
      pendingBusinessVerifications,
      totalBranches,
      totalCustomers,
    ] = await Promise.all([
      User.count(),
      User.count({ where: { is_verified: true } }),
      UserVerification.count({ where: { status: 'pending' } }),
      User.count({ where: { is_verified: false } }),
      Business.count(),
      Business.count({ where: { is_verified: true } }),
      BusinessVerification.count({ where: { status: 'pending' } }),
      Branch.count(),
      Customer.count(),
    ]);

    return {
      success: true,
      message: 'Admin overview retrieved successfully',
      data: {
        users: {
          total: totalUsers,
          verified: verifiedUsers,
          pendingVerification: pendingUserVerifications,
          unverified: unverifiedUsers,
        },
        businesses: {
          total: totalBusinesses,
          verified: verifiedBusinesses,
          pendingVerification: pendingBusinessVerifications,
        },
        activity: {
          pendingUserVerifications,
          pendingBusinessVerifications,
          totalBranches,
          totalCustomers,
        },
      },
    };
  }

  async handleGetUsers() {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
      include: [UserVerification, Business, Branch],
    });

    return {
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  async handleGetUserById(id: string) {
    const user = await User.findByPk(id, {
      include: [UserVerification, Business, Branch],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  async handleGetBusinesses() {
    const businesses = await Business.findAll({
      order: [['createdAt', 'DESC']],
      include: [Branch, BusinessVerification, User],
    });

    return {
      success: true,
      message: 'Businesses retrieved successfully',
      data: businesses,
    };
  }

  async handleGetBusinessById(id: string) {
    const business = await Business.findByPk(id, {
      include: [Branch, BusinessVerification, User],
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return {
      success: true,
      message: 'Business retrieved successfully',
      data: business,
    };
  }

  async handleGetUserVerifications() {
    const verifications = await UserVerification.findAll({
      order: [['createdAt', 'DESC']],
      include: [User],
    });

    return {
      success: true,
      message: 'User verifications retrieved successfully',
      data: verifications,
    };
  }

  async handleGetBusinessVerifications() {
    const verifications = await BusinessVerification.findAll({
      order: [['createdAt', 'DESC']],
      include: [Business],
    });

    return {
      success: true,
      message: 'Business verifications retrieved successfully',
      data: verifications,
    };
  }

  async handleReviewUserVerification(
    verificationId: string,
    action: AdminModerationAction,
  ) {
    const verification = await UserVerification.findByPk(verificationId);

    if (!verification) {
      throw new NotFoundException('User verification not found');
    }

    await verification.update({
      status: action.status,
      reviewed_by: action.reviewed_by,
      reviewed_at: action.reviewed_at,
      rejection_reason: action.rejection_reason ?? verification.rejection_reason,
    });

    await User.update(
      {
        is_verified: action.status === 'verified',
      },
      { where: { id: verification.user_id } },
    );

    return {
      success: true,
      message: 'User verification updated successfully',
      data: verification,
    };
  }

  async handleReviewBusinessVerification(
    verificationId: string,
    action: AdminModerationAction,
  ) {
    const verification = await BusinessVerification.findByPk(verificationId);

    if (!verification) {
      throw new NotFoundException('Business verification not found');
    }

    await verification.update({
      status: action.status,
      reviewed_by: action.reviewed_by,
      reviewed_at: action.reviewed_at,
      rejection_reason: action.rejection_reason ?? verification.rejection_reason,
    });

    await Business.update(
      {
        is_verified: action.status === 'verified',
      },
      { where: { id: verification.business_id } },
    );

    return {
      success: true,
      message: 'Business verification updated successfully',
      data: verification,
    };
  }

  async handleGetCollections() {
    const collections = await Collection.findAll({
      order: [['createdAt', 'DESC']],
      limit: 25,
    });

    return {
      success: true,
      message: 'Collections retrieved successfully',
      data: collections,
    };
  }

  async handleCreateUser(payload: AdminUserPayload) {
    if (!payload.password) {
      throw new BadRequestException('password is required');
    }

    const password = await bcrypt.hash(payload.password, 10);
    const user = await User.create({
      ...payload,
      password,
      credit_score: 0,
      credit_score_status: 'not set',
      is_verified: payload.is_verified ?? true,
      is_email_verified: payload.is_email_verified ?? true,
      sync_status: 'completed',
      sync_date: new Date().toISOString(),
    });

    await Wallet.create({
      user_id: user.id,
      available_balance: 0,
      active_investment_principal: 0,
      total_portfolio: 0,
    });

    await Setting.create({
      user_id: user.id,
      enable_dark_mode: false,
      enable_push_notification: false,
      enable_email_notification: true,
    });

    return { success: true, message: 'User created successfully', data: user };
  }

  async handleUpdateUser(id: string, payload: Partial<AdminUserPayload>) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatePayload = { ...payload } as Partial<User>;
    if (payload.password) {
      updatePayload.password = await bcrypt.hash(payload.password, 10);
    }

    await user.update(updatePayload);
    return { success: true, message: 'User updated successfully', data: user };
  }

  async handleDeleteUser(id: string) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.destroy();
    return { success: true, message: 'User deleted successfully', data: null };
  }

  async handleCreateBusiness(payload: AdminBusinessPayload) {
    const business = await Business.create({
      ...payload,
      is_verified: payload.is_verified ?? false,
      sync_status: 'completed',
      sync_date: new Date().toISOString(),
    });

    return { success: true, message: 'Business created successfully', data: business };
  }

  async handleUpdateBusiness(id: string, payload: Partial<AdminBusinessPayload>) {
    const business = await Business.findByPk(id);
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    await business.update(payload);
    return { success: true, message: 'Business updated successfully', data: business };
  }

  async handleDeleteBusiness(id: string) {
    const business = await Business.findByPk(id);
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    await business.destroy();
    return { success: true, message: 'Business deleted successfully', data: null };
  }

  private toPlain<T>(model: { get: (options: { plain: true }) => T } | null): T | null {
    return model ? model.get({ plain: true }) : null;
  }

  private withSyncDefaults(payload: Record<string, unknown>) {
    return {
      ...payload,
      sync_status: (payload.sync_status as string) ?? 'completed',
      sync_date: (payload.sync_date as string) ?? new Date().toISOString(),
    };
  }

  private async getBranchRelations(branchId: string) {
    const [business, products, customers, branchUsers, inventories, sales, batches] = await Promise.all([
      Branch.findByPk(branchId, { include: [Business] }),
      Product.findAll({ where: { branch_id: branchId }, order: [['createdAt', 'DESC']] }),
      Customer.findAll({ where: { branch_id: branchId }, order: [['createdAt', 'DESC']] }),
      BranchUser.findAll({ where: { branch_id: branchId }, include: [User], order: [['createdAt', 'DESC']] }),
      Inventory.findAll({ where: { branch_id: branchId }, include: [Product, Batch], order: [['createdAt', 'DESC']] }),
      Sales.findAll({ where: { branch_id: branchId }, include: [Customer], order: [['createdAt', 'DESC']] }),
      Batch.findAll({ where: { branch_id: branchId }, include: [Product], order: [['createdAt', 'DESC']] }),
    ]);

    return {
      business: this.toPlain(business),
      products: products.map((item) => item.get({ plain: true })),
      customers: customers.map((item) => item.get({ plain: true })),
      users: branchUsers.map((item) => item.get({ plain: true })),
      inventory: inventories.map((item) => item.get({ plain: true })),
      sales: sales.map((item) => item.get({ plain: true })),
      batches: batches.map((item) => item.get({ plain: true })),
    };
  }

  private async getBusinessRelations(businessId: string) {
    const [branches, users, verification] = await Promise.all([
      Branch.findAll({ where: { business_id: businessId }, order: [['createdAt', 'DESC']] }),
      BusinessUser.findAll({ where: { business_id: businessId }, include: [User], order: [['createdAt', 'DESC']] }),
      BusinessVerification.findOne({ where: { business_id: businessId } }),
    ]);

    const submittedByUser = verification?.submitted_by ? await User.findByPk(verification.submitted_by) : null;
    const reviewedByUser = verification?.reviewed_by ? await User.findByPk(verification.reviewed_by) : null;

    return {
      branches: branches.map((item) => item.get({ plain: true })),
      users: users.map((item) => item.get({ plain: true })),
      verification: verification
        ? {
            ...verification.get({ plain: true }),
            submitted_by_user: this.toPlain(submittedByUser),
            reviewed_by_user: this.toPlain(reviewedByUser),
          }
        : null,
    };
  }

  private async getProductRelations(productId: string) {
    const [batches, inventory, salesItems, movements, productImages] = await Promise.all([
      Batch.findAll({ where: { product_id: productId }, order: [['createdAt', 'DESC']] }),
      Inventory.findAll({ where: { product_id: productId }, include: [Branch, Batch], order: [['createdAt', 'DESC']] }),
      SalesItem.findAll({ where: { product_id: productId }, include: [Sales, Batch], order: [['createdAt', 'DESC']] }),
      StockMovement.findAll({ where: { product_id: productId }, include: [Branch, Batch, User], order: [['createdAt', 'DESC']] }),
      [],
    ]);

    return {
      batches: batches.map((item) => item.get({ plain: true })),
      inventory: inventory.map((item) => item.get({ plain: true })),
      sales_items: salesItems.map((item) => item.get({ plain: true })),
      stock_movements: movements.map((item) => item.get({ plain: true })),
      product_images: productImages,
    };
  }

  private async getGlobalProductRelations(globalProductId: string) {
    const products = await Product.findAll({
      where: { global_product_id: globalProductId },
      include: [Branch],
      order: [['createdAt', 'DESC']],
    });

    return {
      products: products.map((item) => item.get({ plain: true })),
      product_count: products.length,
    };
  }

  private async getSalesRelations(saleId: string) {
    const [items, payments] = await Promise.all([
      SalesItem.findAll({ where: { sale_id: saleId }, include: [Product, Batch], order: [['createdAt', 'DESC']] }),
      Payment.findAll({ where: { sale_id: saleId }, order: [['createdAt', 'DESC']] }),
    ]);

    return {
      items: items.map((item) => item.get({ plain: true })),
      payments: payments.map((item) => item.get({ plain: true })),
    };
  }

  async handleGetGlobalProducts() {
    const records = await GlobalProduct.findAll({ order: [['createdAt', 'DESC']] });

    const data = await Promise.all(records.map(async (record) => {
      const [category, relations] = await Promise.all([
        record.product_category_id ? ProductCategory.findByPk(record.product_category_id) : Promise.resolve(null),
        this.getGlobalProductRelations(record.id),
      ]);

      return {
        ...record.get({ plain: true }),
        product_category: this.toPlain(category),
        ...relations,
      };
    }));

    return { success: true, message: 'Global products retrieved successfully', data };
  }

  async handleGetGlobalProductById(id: string) {
    const record = await GlobalProduct.findByPk(id);
    if (!record) {
      throw new NotFoundException('Global product not found');
    }

    const [category, relations] = await Promise.all([
      record.product_category_id ? ProductCategory.findByPk(record.product_category_id) : Promise.resolve(null),
      this.getGlobalProductRelations(record.id),
    ]);

    return {
      success: true,
      message: 'Global product retrieved successfully',
      data: {
        ...record.get({ plain: true }),
        product_category: this.toPlain(category),
        ...relations,
      },
    };
  }

  async handleGetProductById(id: string) {
    const record = await Product.findByPk(id, {
      include: [Branch, GlobalProduct],
    });
    if (!record) {
      throw new NotFoundException('Product not found');
    }

    const relations = await this.getProductRelations(record.id);

    return {
      success: true,
      message: 'Product retrieved successfully',
      data: {
        ...record.get({ plain: true }),
        ...relations,
      },
    };
  }

  async handleCreateGlobalProduct(payload: Record<string, unknown>) {
    const record = await GlobalProduct.create(
      this.withSyncDefaults({
        ...payload,
        normalized_name: (payload.normalized_name as string) ?? String(payload.name ?? '').toLowerCase().trim().replace(/\s+/g, ' '),
      }) as any,
    );

    return { success: true, message: 'Global product created successfully', data: record };
  }

  async handleUpdateGlobalProduct(id: string, payload: Record<string, unknown>) {
    const record = await GlobalProduct.findByPk(id);
    if (!record) {
      throw new NotFoundException('Global product not found');
    }

    await record.update({
      ...payload,
      normalized_name: (payload.normalized_name as string) ?? (payload.name ? String(payload.name).toLowerCase().trim().replace(/\s+/g, ' ') : record.normalized_name),
    } as any);

    return { success: true, message: 'Global product updated successfully', data: record };
  }

  async handleDeleteGlobalProduct(id: string) {
    const record = await GlobalProduct.findByPk(id);
    if (!record) {
      throw new NotFoundException('Global product not found');
    }

    const linkedProducts = await Product.count({ where: { global_product_id: id } });
    if (linkedProducts > 0) {
      throw new BadRequestException('Delete linked products first');
    }

    await record.destroy();
    return { success: true, message: 'Global product deleted successfully', data: null };
  }

  async handleGetProductCategories() {
    const records = await ProductCategory.findAll({ order: [['createdAt', 'DESC']] });
    const data = await Promise.all(records.map(async (record) => ({
      ...record.get({ plain: true }),
      global_products: await GlobalProduct.count({ where: { product_category_id: record.id } } as any),
    })));

    return { success: true, message: 'Product categories retrieved successfully', data };
  }

  async handleGetProductCategoryById(id: string) {
    const record = await ProductCategory.findByPk(id);
    if (!record) {
      throw new NotFoundException('Product category not found');
    }

    return {
      success: true,
      message: 'Product category retrieved successfully',
      data: {
        ...record.get({ plain: true }),
        global_products: await GlobalProduct.findAll({ where: { product_category_id: id }, order: [['createdAt', 'DESC']] } as any),
      },
    };
  }

  async handleCreateProductCategory(payload: Record<string, unknown>) {
    const record = await ProductCategory.create(this.withSyncDefaults(payload) as any);
    return { success: true, message: 'Product category created successfully', data: record };
  }

  async handleUpdateProductCategory(id: string, payload: Record<string, unknown>) {
    const record = await ProductCategory.findByPk(id);
    if (!record) {
      throw new NotFoundException('Product category not found');
    }

    await record.update(payload as any);
    return { success: true, message: 'Product category updated successfully', data: record };
  }

  async handleDeleteProductCategory(id: string) {
    const record = await ProductCategory.findByPk(id);
    if (!record) {
      throw new NotFoundException('Product category not found');
    }

    const linked = Number(await GlobalProduct.count({ where: { product_category_id: id } } as any));
    if (linked > 0) {
      throw new BadRequestException('Delete linked global products first');
    }

    await record.destroy();
    return { success: true, message: 'Product category deleted successfully', data: null };
  }

  async handleGetBranches() {
    const records = await Branch.findAll({ order: [['createdAt', 'DESC']] });
    const data = await Promise.all(records.map(async (record) => ({
      ...record.get({ plain: true }),
      ...await this.getBranchRelations(record.id),
    })));

    return { success: true, message: 'Branches retrieved successfully', data };
  }

  async handleGetBranchById(id: string) {
    const record = await Branch.findByPk(id);
    if (!record) {
      throw new NotFoundException('Branch not found');
    }

    return {
      success: true,
      message: 'Branch retrieved successfully',
      data: {
        ...record.get({ plain: true }),
        ...await this.getBranchRelations(record.id),
      },
    };
  }

  async handleCreateBranch(payload: Record<string, unknown>) {
    const record = await Branch.create(this.withSyncDefaults(payload) as any);
    return { success: true, message: 'Branch created successfully', data: record };
  }

  async handleUpdateBranch(id: string, payload: Record<string, unknown>) {
    const record = await Branch.findByPk(id);
    if (!record) {
      throw new NotFoundException('Branch not found');
    }

    await record.update(payload as any);
    return { success: true, message: 'Branch updated successfully', data: record };
  }

  async handleDeleteBranch(id: string) {
    const record = await Branch.findByPk(id);
    if (!record) {
      throw new NotFoundException('Branch not found');
    }

    const [products, customers, inventories, sales, batches, branchUsers] = await Promise.all([
      Product.count({ where: { branch_id: id } }),
      Customer.count({ where: { branch_id: id } }),
      Inventory.count({ where: { branch_id: id } }),
      Sales.count({ where: { branch_id: id } }),
      Batch.count({ where: { branch_id: id } }),
      BranchUser.count({ where: { branch_id: id } }),
    ]);

    if (products + customers + inventories + sales + batches + branchUsers > 0) {
      throw new BadRequestException('Delete linked records first');
    }

    await record.destroy();
    return { success: true, message: 'Branch deleted successfully', data: null };
  }

  async handleGetCustomers() {
    const records = await Customer.findAll({ order: [['createdAt', 'DESC']] });
    const data = await Promise.all(records.map(async (record) => ({
      ...record.get({ plain: true }),
      branch: await Branch.findByPk(record.branch_id),
    })));

    return { success: true, message: 'Customers retrieved successfully', data };
  }

  async handleGetCustomerById(id: string) {
    const record = await Customer.findByPk(id);
    if (!record) {
      throw new NotFoundException('Customer not found');
    }

    return {
      success: true,
      message: 'Customer retrieved successfully',
      data: {
        ...record.get({ plain: true }),
        branch: await Branch.findByPk(record.branch_id),
      },
    };
  }

  async handleCreateCustomer(payload: Record<string, unknown>) {
    const record = await Customer.create(this.withSyncDefaults(payload) as any);
    return { success: true, message: 'Customer created successfully', data: record };
  }

  async handleUpdateCustomer(id: string, payload: Record<string, unknown>) {
    const record = await Customer.findByPk(id);
    if (!record) {
      throw new NotFoundException('Customer not found');
    }

    await record.update(payload as any);
    return { success: true, message: 'Customer updated successfully', data: record };
  }

  async handleDeleteCustomer(id: string) {
    const record = await Customer.findByPk(id);
    if (!record) {
      throw new NotFoundException('Customer not found');
    }

    const linked = await Sales.count({ where: { customer_id: id } });
    if (linked > 0) {
      throw new BadRequestException('Delete linked sales first');
    }

    await record.destroy();
    return { success: true, message: 'Customer deleted successfully', data: null };
  }

  async handleGetBusinessUsers() {
    const records = await BusinessUser.findAll({ include: [User, Business], order: [['createdAt', 'DESC']] });
    return { success: true, message: 'Business users retrieved successfully', data: records.map((record) => record.get({ plain: true })) };
  }

  async handleCreateBusinessUser(payload: Record<string, unknown>) {
    const record = await BusinessUser.create(this.withSyncDefaults(payload) as any);
    return { success: true, message: 'Business user created successfully', data: record };
  }

  async handleUpdateBusinessUser(id: string, payload: Record<string, unknown>) {
    const record = await BusinessUser.findByPk(id);
    if (!record) {
      throw new NotFoundException('Business user not found');
    }

    await record.update(payload as any);
    return { success: true, message: 'Business user updated successfully', data: record };
  }

  async handleDeleteBusinessUser(id: string) {
    const record = await BusinessUser.findByPk(id);
    if (!record) {
      throw new NotFoundException('Business user not found');
    }

    await record.destroy();
    return { success: true, message: 'Business user deleted successfully', data: null };
  }

  async handleGetBranchUsers() {
    const records = await BranchUser.findAll({ include: [User, Branch], order: [['createdAt', 'DESC']] });
    return { success: true, message: 'Branch users retrieved successfully', data: records.map((record) => record.get({ plain: true })) };
  }

  async handleCreateBranchUser(payload: Record<string, unknown>) {
    const record = await BranchUser.create(this.withSyncDefaults(payload) as any);
    return { success: true, message: 'Branch user created successfully', data: record };
  }

  async handleUpdateBranchUser(id: string, payload: Record<string, unknown>) {
    const record = await BranchUser.findByPk(id);
    if (!record) {
      throw new NotFoundException('Branch user not found');
    }

    await record.update(payload as any);
    return { success: true, message: 'Branch user updated successfully', data: record };
  }

  async handleDeleteBranchUser(id: string) {
    const record = await BranchUser.findByPk(id);
    if (!record) {
      throw new NotFoundException('Branch user not found');
    }

    await record.destroy();
    return { success: true, message: 'Branch user deleted successfully', data: null };
  }

  async handleGetSalesItems() {
    const records = await SalesItem.findAll({ include: [Sales, Product, Batch], order: [['createdAt', 'DESC']] });
    return { success: true, message: 'Sales items retrieved successfully', data: records.map((record) => record.get({ plain: true })) };
  }

  async handleGetSalesItemById(id: string) {
    const record = await SalesItem.findByPk(id, { include: [Sales, Product, Batch] });
    if (!record) {
      throw new NotFoundException('Sales item not found');
    }

    return { success: true, message: 'Sales item retrieved successfully', data: record.get({ plain: true }) };
  }

  async handleCreateSalesItem(payload: Record<string, unknown>) {
    const record = await SalesItem.create(this.withSyncDefaults(payload) as any);
    return { success: true, message: 'Sales item created successfully', data: record };
  }

  async handleUpdateSalesItem(id: string, payload: Record<string, unknown>) {
    const record = await SalesItem.findByPk(id);
    if (!record) {
      throw new NotFoundException('Sales item not found');
    }

    await record.update(payload as any);
    return { success: true, message: 'Sales item updated successfully', data: record };
  }

  async handleDeleteSalesItem(id: string) {
    const record = await SalesItem.findByPk(id);
    if (!record) {
      throw new NotFoundException('Sales item not found');
    }

    await record.destroy();
    return { success: true, message: 'Sales item deleted successfully', data: null };
  }

  async handleGetStockMovements() {
    const records = await StockMovement.findAll({ include: [Product, Branch, Batch, User], order: [['createdAt', 'DESC']] });
    return { success: true, message: 'Stock movements retrieved successfully', data: records.map((record) => record.get({ plain: true })) };
  }

  async handleGetStockMovementById(id: string) {
    const record = await StockMovement.findByPk(id, { include: [Product, Branch, Batch, User] });
    if (!record) {
      throw new NotFoundException('Stock movement not found');
    }

    return { success: true, message: 'Stock movement retrieved successfully', data: record.get({ plain: true }) };
  }

  async handleCreateStockMovement(payload: Record<string, unknown>) {
    const record = await StockMovement.create(this.withSyncDefaults(payload) as any);
    return { success: true, message: 'Stock movement created successfully', data: record };
  }

  async handleUpdateStockMovement(id: string, payload: Record<string, unknown>) {
    const record = await StockMovement.findByPk(id);
    if (!record) {
      throw new NotFoundException('Stock movement not found');
    }

    await record.update(payload as any);
    return { success: true, message: 'Stock movement updated successfully', data: record };
  }

  async handleDeleteStockMovement(id: string) {
    const record = await StockMovement.findByPk(id);
    if (!record) {
      throw new NotFoundException('Stock movement not found');
    }

    await record.destroy();
    return { success: true, message: 'Stock movement deleted successfully', data: null };
  }

  async handleGetStockTransfers() {
    const records = await StockTransfer.findAll({ order: [['createdAt', 'DESC']] });
    const data = await Promise.all(records.map(async (record) => {
      const [createdBy, fromBranch, toBranch, items] = await Promise.all([
        record.created_by_id ? User.findByPk(record.created_by_id) : Promise.resolve(null),
        record.from_branch_id ? Branch.findByPk(record.from_branch_id) : Promise.resolve(null),
        record.to_branch_id ? Branch.findByPk(record.to_branch_id) : Promise.resolve(null),
        StockTransferItem.findAll({ where: { transfer_id: record.id }, include: [Product], order: [['createdAt', 'DESC']] }),
      ]);

      return {
        ...record.get({ plain: true }),
        created_by: this.toPlain(createdBy),
        from_branch: this.toPlain(fromBranch),
        to_branch: this.toPlain(toBranch),
        items: items.map((item) => item.get({ plain: true })),
      };
    }));

    return { success: true, message: 'Stock transfers retrieved successfully', data };
  }

  async handleGetStockTransferById(id: string) {
    const record = await StockTransfer.findByPk(id);
    if (!record) {
      throw new NotFoundException('Stock transfer not found');
    }

    const [createdBy, fromBranch, toBranch, items] = await Promise.all([
      record.created_by_id ? User.findByPk(record.created_by_id) : Promise.resolve(null),
      record.from_branch_id ? Branch.findByPk(record.from_branch_id) : Promise.resolve(null),
      record.to_branch_id ? Branch.findByPk(record.to_branch_id) : Promise.resolve(null),
      StockTransferItem.findAll({ where: { transfer_id: record.id }, include: [Product], order: [['createdAt', 'DESC']] }),
    ]);
    return {
      success: true,
      message: 'Stock transfer retrieved successfully',
      data: {
        ...record.get({ plain: true }),
        created_by: this.toPlain(createdBy),
        from_branch: this.toPlain(fromBranch),
        to_branch: this.toPlain(toBranch),
        items: items.map((item) => item.get({ plain: true })),
      },
    };
  }

  async handleCreateStockTransfer(payload: Record<string, unknown>) {
    const record = await StockTransfer.create(this.withSyncDefaults(payload) as any);
    return { success: true, message: 'Stock transfer created successfully', data: record };
  }

  async handleUpdateStockTransfer(id: string, payload: Record<string, unknown>) {
    const record = await StockTransfer.findByPk(id);
    if (!record) {
      throw new NotFoundException('Stock transfer not found');
    }

    await record.update(payload as any);
    return { success: true, message: 'Stock transfer updated successfully', data: record };
  }

  async handleDeleteStockTransfer(id: string) {
    const record = await StockTransfer.findByPk(id);
    if (!record) {
      throw new NotFoundException('Stock transfer not found');
    }

    const linked = await StockTransferItem.count({ where: { transfer_id: id } });
    if (linked > 0) {
      throw new BadRequestException('Delete linked transfer items first');
    }

    await record.destroy();
    return { success: true, message: 'Stock transfer deleted successfully', data: null };
  }

  async handleGetPayments() {
    const records = await Payment.findAll({ order: [['createdAt', 'DESC']] });
    const data = await Promise.all(records.map(async (record) => {
      const sale = record.sale_id ? await Sales.findByPk(record.sale_id, { include: [Customer, Branch] }) : null;
      return { ...record.get({ plain: true }), sale: this.toPlain(sale) };
    }));

    return { success: true, message: 'Payments retrieved successfully', data };
  }

  async handleGetPaymentById(id: string) {
    const record = await Payment.findByPk(id);
    if (!record) {
      throw new NotFoundException('Payment not found');
    }

    const sale = record.sale_id ? await Sales.findByPk(record.sale_id, { include: [Customer, Branch] }) : null;
    return {
      success: true,
      message: 'Payment retrieved successfully',
      data: { ...record.get({ plain: true }), sale: this.toPlain(sale) },
    };
  }

  async handleCreatePayment(payload: Record<string, unknown>) {
    const record = await Payment.create(this.withSyncDefaults(payload) as any);
    return { success: true, message: 'Payment created successfully', data: record };
  }

  async handleUpdatePayment(id: string, payload: Record<string, unknown>) {
    const record = await Payment.findByPk(id);
    if (!record) {
      throw new NotFoundException('Payment not found');
    }

    await record.update(payload as any);
    return { success: true, message: 'Payment updated successfully', data: record };
  }

  async handleDeletePayment(id: string) {
    const record = await Payment.findByPk(id);
    if (!record) {
      throw new NotFoundException('Payment not found');
    }

    await record.destroy();
    return { success: true, message: 'Payment deleted successfully', data: null };
  }
}
