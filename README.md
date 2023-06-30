# geek-server
## 程序部署信息
部署路径：/root/webapps/geek-server
端口：
## 部署流程
pm2 ls 找到该程序的id
pm2 del id
将更新的代码复制过去
进入程序目录
npm run start 启动程序

## 注意事项
1. 注意覆盖程序的时候只覆盖更改的文件，src/data目录不要替换掉
2. 如果安装了新的依赖，需要把package.json文件替换掉
2. 注意现网端口是22222


## 部署流程20230630
执行 npm run pm2时报错：
[PM2][ERROR] Interpreter /usr/local/lib/node_modules/pm2/node_modules/.bin/ts-node is NOT AVAILABLE in PATH. (type 'which /usr/local/lib/node_modules/pm2/node_modules/.bin/ts-node' to double check.)
解决方法：创建符号链接(你可以创建一个符号链接，将 /usr/local/bin/ts-node 指向 /usr/local/lib/node_modules/pm2/node_modules/.bin/ts-node)
ln -s /usr/local/bin/ts-node /usr/local/lib/node_modules/pm2/node_modules/.bin/ts-node
