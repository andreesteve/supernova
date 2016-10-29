#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

out=$DIR/out

mkdir -p $out
browserify game/index.js -o $out/bundle.js
