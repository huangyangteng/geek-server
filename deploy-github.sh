#/bin/bash
cd /root/geek-server
pnpm install && pnpm build
pm2 restart server
