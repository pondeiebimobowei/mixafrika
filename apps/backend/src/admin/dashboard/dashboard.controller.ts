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
