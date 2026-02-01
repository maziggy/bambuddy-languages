#!/bin/bash

npm install && npm run build && rm -rf assets && cp -rf dist/* .
