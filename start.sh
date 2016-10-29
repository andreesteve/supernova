#!/bin/sh
sleep 1 && chromium http://localhost:9966 &
beefy game/index.js:out/bundle.js
