#!/bin/bash

git pull && rm -rf dist.tar.gz && npm run build && tar zcvf dist.tar.gz dist && scp -P2233 dist.tar.gz gjy@g2.huaqie.com:/home/lifesurge/website/mp3
