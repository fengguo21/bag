#!/bin/bash
rm -rf dist.tar.gz && npm run build && tar zcvf dist.tar.gz dist && scp -P2233 dist.tar.gz lifesurge@g2.huaqie.com:/home/lifesurge/website/mp3 && ssh g2
