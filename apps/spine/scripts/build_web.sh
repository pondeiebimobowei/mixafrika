#!/bin/sh
set -eu

BASE_URL="${1:-https://api.mixafrika.com/v1}"

flutter pub get
flutter build web --release --dart-define=base_url="$BASE_URL"

rm -rf deploy/web
mkdir -p deploy/web
cp -R build/web/. deploy/web/
