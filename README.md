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
修复启动错误
pm2 start --interpreter="node_modules/.bin/ts-node" src/server.ts
