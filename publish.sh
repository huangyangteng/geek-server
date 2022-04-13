#/bin/bash

# 把src下面的文件同步到服务器
LOCAL_DIR=src/
SERVER=root@111.229.14.189:/root/webapps/geek-server/src
rsync -v   --progress --stats -r -t -p -l -z -e 'ssh -p 22' --delete  $LOCAL_DIR  $SERVER
# 把package.json同步到服务器
rsync -v   --progress --stats -r -t -p -l -z -e 'ssh -p 22' --delete  package.json  root@111.229.14.189:/root/webapps/geek-server/
