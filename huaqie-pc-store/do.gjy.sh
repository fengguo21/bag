#!/bin/bash

git pull && rm -rf dist.tar.gz && npm run build && tar zcvf dist.tar.gz dist && scp -P22 dist.tar.gz root@103.28.39.38:/var/www/html
