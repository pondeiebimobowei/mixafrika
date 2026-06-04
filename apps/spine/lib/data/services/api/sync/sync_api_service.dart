import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/config/base_api_config.dart';
import 'package:spine/data/services/api/sync/sync_models.dart';

class SyncApiService {
  Future<ApiResponse<SyncPayload>> runSync({
    String? cursor,
    required List<SyncMutation> mutations,
  }) async {
    try {
      final response = await apiPrivate.post(
        '/sync',
        data: {
          'cursor': cursor,
          'mutations': mutations.map((mutation) => mutation.toJson()).toList(),
        },
      );

      return ApiResponse.fromJson(
        response.data,
        (data) => SyncPayload.fromJson(Map<String, dynamic>.from(data)),
      );
    } on DioException catch (err) {
      return ApiResponse(
        success: false,
        message: err.response?.data['message'] ?? err.message ?? 'Sync failed',
        data: SyncPayload.empty(),
      );
    }
  }
}

final syncApiServiceProvider = Provider((ref) => SyncApiService());
