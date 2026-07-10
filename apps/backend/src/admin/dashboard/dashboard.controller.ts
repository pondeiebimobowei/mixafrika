import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AdminDashboardService } from './dashboard.service';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { User } from 'src/database/models/user.model';
import { AdminBusinessPayload, AdminModerationAction, AdminUserPayload } from '../admin.types';

@Controller('v1/admin')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get('dashboard/overview')
  getOverview() {
    return this.adminDashboardService.handleGetOverview();
  }

  @Get('users')
  getUsers() {
    return this.adminDashboardService.handleGetUsers();
  }

  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.adminDashboardService.handleGetUserById(id);
  }

  @Get('businesses')
  getBusinesses() {
    return this.adminDashboardService.handleGetBusinesses();
  }

  @Get('businesses/:id')
  getBusinessById(@Param('id') id: string) {
    return this.adminDashboardService.handleGetBusinessById(id);
  }

  @Get('verifications/users')
  getUserVerifications() {
    return this.adminDashboardService.handleGetUserVerifications();
  }

  @Get('verifications/businesses')
  getBusinessVerifications() {
    return this.adminDashboardService.handleGetBusinessVerifications();
  }

  @Get('collections')
  getCollections() {
    return this.adminDashboardService.handleGetCollections();
  }

  @Get('spine/global-products')
  getGlobalProducts() {
    return this.adminDashboardService.handleGetGlobalProducts();
  }

  @Get('spine/global-products/:id')
  getGlobalProductById(@Param('id') id: string) {
    return this.adminDashboardService.handleGetGlobalProductById(id);
  }

  @Post('spine/global-products')
  createGlobalProduct(@Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleCreateGlobalProduct(body);
  }

  @Patch('spine/global-products/:id')
  updateGlobalProduct(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleUpdateGlobalProduct(id, body);
  }

  @Delete('spine/global-products/:id')
  deleteGlobalProduct(@Param('id') id: string) {
    return this.adminDashboardService.handleDeleteGlobalProduct(id);
  }

  @Get('spine/product-categories')
  getProductCategories() {
    return this.adminDashboardService.handleGetProductCategories();
  }

  @Get('spine/product-categories/:id')
  getProductCategoryById(@Param('id') id: string) {
    return this.adminDashboardService.handleGetProductCategoryById(id);
  }

  @Post('spine/product-categories')
  createProductCategory(@Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleCreateProductCategory(body);
  }

  @Patch('spine/product-categories/:id')
  updateProductCategory(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleUpdateProductCategory(id, body);
  }

  @Delete('spine/product-categories/:id')
  deleteProductCategory(@Param('id') id: string) {
    return this.adminDashboardService.handleDeleteProductCategory(id);
  }

  @Get('spine/branches')
  getBranches() {
    return this.adminDashboardService.handleGetBranches();
  }

  @Get('spine/branches/:id')
  getBranchById(@Param('id') id: string) {
    return this.adminDashboardService.handleGetBranchById(id);
  }

  @Post('spine/branches')
  createBranch(@Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleCreateBranch(body);
  }

  @Patch('spine/branches/:id')
  updateBranch(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleUpdateBranch(id, body);
  }

  @Delete('spine/branches/:id')
  deleteBranch(@Param('id') id: string) {
    return this.adminDashboardService.handleDeleteBranch(id);
  }

  @Get('spine/customers')
  getCustomers() {
    return this.adminDashboardService.handleGetCustomers();
  }

  @Get('spine/customers/:id')
  getCustomerById(@Param('id') id: string) {
    return this.adminDashboardService.handleGetCustomerById(id);
  }

  @Post('spine/customers')
  createCustomer(@Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleCreateCustomer(body);
  }

  @Patch('spine/customers/:id')
  updateCustomer(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleUpdateCustomer(id, body);
  }

  @Delete('spine/customers/:id')
  deleteCustomer(@Param('id') id: string) {
    return this.adminDashboardService.handleDeleteCustomer(id);
  }

  @Get('spine/business-users')
  getBusinessUsers() {
    return this.adminDashboardService.handleGetBusinessUsers();
  }

  @Post('spine/business-users')
  createBusinessUser(@Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleCreateBusinessUser(body);
  }

  @Patch('spine/business-users/:id')
  updateBusinessUser(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleUpdateBusinessUser(id, body);
  }

  @Delete('spine/business-users/:id')
  deleteBusinessUser(@Param('id') id: string) {
    return this.adminDashboardService.handleDeleteBusinessUser(id);
  }

  @Get('spine/branch-users')
  getBranchUsers() {
    return this.adminDashboardService.handleGetBranchUsers();
  }

  @Post('spine/branch-users')
  createBranchUser(@Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleCreateBranchUser(body);
  }

  @Patch('spine/branch-users/:id')
  updateBranchUser(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleUpdateBranchUser(id, body);
  }

  @Delete('spine/branch-users/:id')
  deleteBranchUser(@Param('id') id: string) {
    return this.adminDashboardService.handleDeleteBranchUser(id);
  }

  @Get('spine/sales-items')
  getSalesItems() {
    return this.adminDashboardService.handleGetSalesItems();
  }

  @Get('spine/sales-items/:id')
  getSalesItemById(@Param('id') id: string) {
    return this.adminDashboardService.handleGetSalesItemById(id);
  }

  @Post('spine/sales-items')
  createSalesItem(@Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleCreateSalesItem(body);
  }

  @Patch('spine/sales-items/:id')
  updateSalesItem(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleUpdateSalesItem(id, body);
  }

  @Delete('spine/sales-items/:id')
  deleteSalesItem(@Param('id') id: string) {
    return this.adminDashboardService.handleDeleteSalesItem(id);
  }

  @Get('spine/stock-movements')
  getStockMovements() {
    return this.adminDashboardService.handleGetStockMovements();
  }

  @Get('spine/stock-movements/:id')
  getStockMovementById(@Param('id') id: string) {
    return this.adminDashboardService.handleGetStockMovementById(id);
  }

  @Post('spine/stock-movements')
  createStockMovement(@Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleCreateStockMovement(body);
  }

  @Patch('spine/stock-movements/:id')
  updateStockMovement(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleUpdateStockMovement(id, body);
  }

  @Delete('spine/stock-movements/:id')
  deleteStockMovement(@Param('id') id: string) {
    return this.adminDashboardService.handleDeleteStockMovement(id);
  }

  @Get('spine/stock-transfers')
  getStockTransfers() {
    return this.adminDashboardService.handleGetStockTransfers();
  }

  @Get('spine/stock-transfers/:id')
  getStockTransferById(@Param('id') id: string) {
    return this.adminDashboardService.handleGetStockTransferById(id);
  }

  @Post('spine/stock-transfers')
  createStockTransfer(@Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleCreateStockTransfer(body);
  }

  @Patch('spine/stock-transfers/:id')
  updateStockTransfer(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleUpdateStockTransfer(id, body);
  }

  @Delete('spine/stock-transfers/:id')
  deleteStockTransfer(@Param('id') id: string) {
    return this.adminDashboardService.handleDeleteStockTransfer(id);
  }

  @Get('spine/payments')
  getPayments() {
    return this.adminDashboardService.handleGetPayments();
  }

  @Get('spine/payments/:id')
  getPaymentById(@Param('id') id: string) {
    return this.adminDashboardService.handleGetPaymentById(id);
  }

  @Post('spine/payments')
  createPayment(@Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleCreatePayment(body);
  }

  @Patch('spine/payments/:id')
  updatePayment(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.adminDashboardService.handleUpdatePayment(id, body);
  }

  @Delete('spine/payments/:id')
  deletePayment(@Param('id') id: string) {
    return this.adminDashboardService.handleDeletePayment(id);
  }

  @Post('users')
  createUser(@Body() body: AdminUserPayload) {
    return this.adminDashboardService.handleCreateUser(body);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() body: Partial<AdminUserPayload>) {
    return this.adminDashboardService.handleUpdateUser(id, body);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminDashboardService.handleDeleteUser(id);
  }

  @Post('businesses')
  createBusiness(@Body() body: AdminBusinessPayload) {
    return this.adminDashboardService.handleCreateBusiness(body);
  }

  @Patch('businesses/:id')
  updateBusiness(@Param('id') id: string, @Body() body: Partial<AdminBusinessPayload>) {
    return this.adminDashboardService.handleUpdateBusiness(id, body);
  }

  @Delete('businesses/:id')
  deleteBusiness(@Param('id') id: string) {
    return this.adminDashboardService.handleDeleteBusiness(id);
  }

  @Patch('verifications/users/:id')
  reviewUserVerification(
    @Param('id') id: string,
    @Body() body: Omit<AdminModerationAction, 'reviewed_by' | 'reviewed_at'> & Partial<Pick<AdminModerationAction, 'rejection_reason'>>,
    @ParsedToken() admin: User,
  ) {
    return this.adminDashboardService.handleReviewUserVerification(id, {
      status: body.status,
      reviewed_by: admin.id,
      reviewed_at: new Date().toISOString(),
      rejection_reason: body.rejection_reason,
    });
  }

  @Patch('verifications/businesses/:id')
  reviewBusinessVerification(
    @Param('id') id: string,
    @Body() body: Omit<AdminModerationAction, 'reviewed_by' | 'reviewed_at'> & Partial<Pick<AdminModerationAction, 'rejection_reason'>>,
    @ParsedToken() admin: User,
  ) {
    return this.adminDashboardService.handleReviewBusinessVerification(id, {
      status: body.status,
      reviewed_by: admin.id,
      reviewed_at: new Date().toISOString(),
      rejection_reason: body.rejection_reason,
    });
  }
}
