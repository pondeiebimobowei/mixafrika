# spine

Flutter app for SPINE.

## Getting Started

The web deployment in `deploy/web` is what Coolify serves.
Build locally, then copy the generated `build/web` output into `deploy/web`.

Example:

```sh
cd apps/spine
sh scripts/build_web.sh https://api.mixafrika.com/v1
```

That command rebuilds the web bundle with the correct API endpoint and refreshes `deploy/web` in place.

A few resources to get you started if this is your first Flutter project:

- [Learn Flutter](https://docs.flutter.dev/get-started/learn-flutter)
- [Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Flutter learning resources](https://docs.flutter.dev/reference/learning-resources)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.
