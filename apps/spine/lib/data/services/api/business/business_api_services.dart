import 'package:dio/dio.dart';
import 'package:spine/data/services/api/business/business_api_services_abstract.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/config/base_api_config.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/services/models/branch_model.dart';
import 'package:spine/data/services/models/business_model.dart';
import 'package:spine/drift/database.dart';

class BusinessApiServices implements BusinessApiServicesAbstract {
  @override
  Future<ApiResponse<List<BusinessesData>>> getBusinesses() async {
    try {
      final res = await apiPrivate.get('/business');

      return ApiResponse.fromJson(
        res.data,
        (data) => (data as List).map((e) => BusinessMapper.fromJson(e).toData()).toList(),
      );
    } on DioException catch (err) {
      if (err.response?.data != null) {
        return ApiResponse.fromJson(err.response!.data, (_) => <BusinessesData>[]);
      }

      return ApiResponse(
        success: false,
        message: err.message ?? 'Unknown error',
        data: [],
      );
    }
  }

  @override
Future<ApiResponse<BusinessWithBranch>> createBusiness(
  BusinessesData business,
) async {
  try {
    final res = await apiPrivate.post(
      '/business',
      data: {
        'name': business.name,
        'type': business.type,
        'phone': business.phone,
        'street_address': business.streetAddress,
        'city': business.city,
        'state': business.state,
        'country': business.country,
        'sync_status': business.syncStatus,
      },
    );

    // Extract the business object from the 'data' key of the response
    final rawData = res.data['data']; 

    // Now the mapper sees 'name', 'type', etc. at the correct level
    final businessResult = BusinessMapper.fromJson(rawData).toData();
    final List<dynamic> branchList = rawData['branches'] ?? [];
    final List<BranchData> branches = branchList.map((branchJson) {
      // Pass each individual branch JSON to your BranchMapper
      return BranchMapper.fromJson(branchJson as Map<String, dynamic>).toData();
    }).toList();

    return ApiResponse(
      success: res.data['success'] ?? true,
      message: res.data['message'] ?? 'Business created successfully',
      data: BusinessWithBranch(business: businessResult, branches: branches),
    );
  } on DioException catch (err) {
    return ApiResponse(
      success: false,
      message: err.message ?? 'Unknown error',
      data: null as dynamic,
    );
  }
}
}

final businessApiServiceProvider = Provider((ref) => BusinessApiServices());
