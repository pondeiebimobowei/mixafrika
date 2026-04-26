import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:spine/data/repositories/team/team_repository_local.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/ui/team_management/view_model/team_management_view_model.dart';

class MockTeamRepositoryLocal extends Mock implements TeamRepositoryLocal {}

void main() {
  late ProviderContainer container;
  late MockTeamRepositoryLocal mockTeamRepository;

  setUp(() async {
    SharedPreferences.setMockInitialValues({
      'active_business_id': 'biz_123',
      'active_branch_id': 'branch_123',
    });

    mockTeamRepository = MockTeamRepositoryLocal();
    
    container = ProviderContainer(
      overrides: [
        teamRepositoryLocalProvider.overrideWithValue(mockTeamRepository),
      ],
    );
  });

  group('TeamManagementViewModel', () {
    test('initial state should be loading and then fetch data', () async {
      // Arrange
      when(() => mockTeamRepository.getBranchTeamMembers(any()))
          .thenAnswer((_) async => ApiResponse(success: true, message: 'Success', data: []));
      when(() => mockTeamRepository.getBranchPendingInvitations(any()))
          .thenAnswer((_) async => ApiResponse(success: true, message: 'Success', data: []));

      // Act
      final viewModel = container.read(teamManagementViewModelProvider.notifier);
      
      // Wait for the async constructor logic to complete
      await Future.delayed(Duration.zero);

      // Assert
      final state = container.read(teamManagementViewModelProvider);
      expect(state.isLoading, false);
      expect(state.members, isEmpty);
      expect(state.invitations, isEmpty);
      verify(() => mockTeamRepository.getBranchTeamMembers('branch_123')).called(1);
      verify(() => mockTeamRepository.getBranchPendingInvitations('branch_123')).called(1);
    });

    test('inviteMember should call repository and reload data', () async {
      // Arrange
      when(() => mockTeamRepository.getBranchTeamMembers(any()))
          .thenAnswer((_) async => ApiResponse(success: true, message: 'Success', data: []));
      when(() => mockTeamRepository.getBranchPendingInvitations(any()))
          .thenAnswer((_) async => ApiResponse(success: true, message: 'Success', data: []));
      when(() => mockTeamRepository.inviteMember(
        businessId: any(named: 'businessId'),
        email: any(named: 'email'),
        role: any(named: 'role'),
        branchId: any(named: 'branchId'),
      )).thenAnswer((_) async => ApiResponse(success: true, message: 'Invited', data: null));

      final viewModel = container.read(teamManagementViewModelProvider.notifier);
      await Future.delayed(Duration.zero);

      // Act
      final result = await viewModel.inviteMember(
        email: 'new@member.com',
        role: 'admin',
        branchId: 'branch_123',
      );

      // Assert
      expect(result, true);
      verify(() => mockTeamRepository.inviteMember(
        businessId: 'biz_123',
        email: 'new@member.com',
        role: 'admin',
        branchId: 'branch_123',
      )).called(1);
      // Verify loadTeamData was called again (so getBranchTeamMembers called twice total)
      verify(() => mockTeamRepository.getBranchTeamMembers('branch_123')).called(2);
    });
  });
}
