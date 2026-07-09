import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { AdminDashboardService } from './dashboard.service';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { User } from 'src/database/models/user.model';
import { AdminModerationAction } from '../admin.types';

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
