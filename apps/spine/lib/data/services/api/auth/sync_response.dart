import 'package:spine/data/services/models/user_model.dart';
import 'package:spine/data/services/models/business_model.dart';
import 'package:spine/data/services/models/branch_model.dart';
import 'package:spine/data/services/models/business_user_model.dart';
import 'package:spine/data/services/models/branch_user_model.dart';

class SyncResponse {
  final User? user;
  final List<BusinessUserModel> businessUsers;
  final List<BusinessMapper> businesses;
  final List<BranchUserModel> branchUsers;
  final List<BranchMapper> branches;

  SyncResponse({
    required this.user,
    required this.businessUsers,
    required this.businesses,
    required this.branchUsers,
    required this.branches,
  });

  factory SyncResponse.fromJson(Map<String, dynamic> json) {
    return SyncResponse(
      user: User.fromJson(json['user']),
      businessUsers: (json['business_users'] as List)
          .map((e) => BusinessUserModel.fromJson(e))
          .toList(),
      businesses: (json['businesses'] as List)
          .map((e) => BusinessMapper.fromJson(e))
          .toList(),
      branchUsers: (json['branch_users'] as List)
          .map((e) => BranchUserModel.fromJson(e))
          .toList(),
      branches: (json['branches'] as List)
          .map((e) => BranchMapper.fromJson(e))
          .toList(),
    );
  }
}
