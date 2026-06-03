import { ForbiddenException } from '@nestjs/common';
import { TeamService } from './team.service';
import { Invites } from 'src/database/models/invites.model';
import { User } from 'src/database/models/user.model';
import { TenantAccessService } from 'src/access/tenant-access.service';

describe('TeamService', () => {
  let tenantAccessService: jest.Mocked<TenantAccessService>;
  let service: TeamService;

  beforeEach(() => {
    tenantAccessService = {
      assertBusinessManagement: jest.fn(),
      assertBranchBelongsToBusiness: jest.fn(),
      assertBranchAccess: jest.fn(),
    } as unknown as jest.Mocked<TenantAccessService>;
    service = new TeamService(tenantAccessService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('rejects invites from users without business management access', async () => {
    tenantAccessService.assertBusinessManagement.mockRejectedValue(
      new ForbiddenException(),
    );

    await expect(
      service.handleInviteMember('user-1', 'business-1', {
        email: 'invitee@example.com',
        role: 'trader',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects accepting an invite for a different email address', async () => {
    jest.spyOn(Invites, 'findOne').mockResolvedValue({
      email: 'owner@example.com',
      accepted: false,
      expires_at: new Date(Date.now() + 60_000).toISOString(),
      business_id: 'business-1',
      role: 'trader',
      save: jest.fn(),
    } as any);
    jest.spyOn(User, 'findByPk').mockResolvedValue({
      email: 'someone-else@example.com',
    } as any);

    await expect(
      service.handleAcceptInvitation('token-1', 'user-1'),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
