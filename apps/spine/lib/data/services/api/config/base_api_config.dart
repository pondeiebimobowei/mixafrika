import 'package:dio/dio.dart';
// import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:spine/data/shared_preference.dart';

// `base_url` is read at build time via `--dart-define`.
// Update the Docker build arg or pass `--dart-define=base_url=...` when rebuilding.
final String baseUrl = String.fromEnvironment(
  'base_url',
  defaultValue: 'https://api.mixafrika.com/v1',
);

final Dio apiPrivate =
    Dio(
        BaseOptions(
          baseUrl: baseUrl,
          headers: {'Content-Type': 'application/json'},
        ),
      )
      ..interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) async {
            final token = await TokenManager.getToken();
            if (token != null && token.isNotEmpty) {
              options.headers['Authorization'] = 'Bearer $token';
            }
            return handler.next(options);
          },
        ),
      );

final Dio api =
    Dio(
        BaseOptions(
          baseUrl: baseUrl,
          headers: {'Content-Type': 'application/json'},
        ),
      );
