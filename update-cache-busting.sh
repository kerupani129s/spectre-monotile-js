#!/bin/bash
set -euoo pipefail posix
cd "$(dirname "$0")"

# 
function openssl_md4() {
	# OpenSSL 3.0 & OpenSSL 1.1
	openssl md4 -provider legacy "$@" 2>/dev/null || openssl md4 "$@"
}

function content_hash() {
	local -r file="$1"
	openssl_md4 "$file" | awk '{ print substr($NF, 0, 20) }'
}

# 
SPECTRE_JS_PARAM="v=$(content_hash ./docs/spectre.js)"
readonly SPECTRE_JS_PARAM
MAIN_JS_PARAM="v=$(content_hash ./docs/main.js)"
readonly MAIN_JS_PARAM
VERTEX_ANGLES_MAIN_JS_PARAM="v=$(content_hash ./docs/vertex-angles/main.js)"
readonly VERTEX_ANGLES_MAIN_JS_PARAM
PERIODIC_TILING_MAIN_JS_PARAM="v=$(content_hash ./docs/periodic-tiling/main.js)"
readonly PERIODIC_TILING_MAIN_JS_PARAM
APERIODIC_TILING_MAIN_JS_PARAM="v=$(content_hash ./docs/aperiodic-tiling/main.js)"
readonly APERIODIC_TILING_MAIN_JS_PARAM

# 
sed -Ei \
	-e 's/(["/]spectre\.js\?)[^"]*/\1'"$SPECTRE_JS_PARAM"'/g' \
	-e 's/(["/]main\.js\?)[^"]*/\1'"$MAIN_JS_PARAM"'/g' \
	./docs/index.html

sed -Ei \
	-e 's/(["/]spectre\.js\?)[^"]*/\1'"$SPECTRE_JS_PARAM"'/g' \
	-e 's/(["/]main\.js\?)[^"]*/\1'"$VERTEX_ANGLES_MAIN_JS_PARAM"'/g' \
	./docs/vertex-angles/index.html

sed -Ei \
	-e 's/(["/]spectre\.js\?)[^"]*/\1'"$SPECTRE_JS_PARAM"'/g' \
	-e 's/(["/]main\.js\?)[^"]*/\1'"$PERIODIC_TILING_MAIN_JS_PARAM"'/g' \
	./docs/periodic-tiling/index.html

sed -Ei \
	-e 's/(["/]spectre\.js\?)[^"]*/\1'"$SPECTRE_JS_PARAM"'/g' \
	-e 's/(["/]main\.js\?)[^"]*/\1'"$APERIODIC_TILING_MAIN_JS_PARAM"'/g' \
	./docs/aperiodic-tiling/index.html

# 
echo 'OK'
