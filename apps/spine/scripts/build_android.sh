#!/bin/sh
set -eu

BASE_URL="${1:-https://api.mixafrika.com/v1}"

flutter pub get
flutter build apk --release --dart-define=base_url="$BASE_URL"

