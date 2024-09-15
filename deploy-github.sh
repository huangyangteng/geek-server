#/bin/bash
cd /root/geek-server
pnpm install &&
pm2 restart server
#pm2 start npm --name "hhh-website"  -- start
