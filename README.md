# 使用方法

1. 仓库同目录下新建 qiniu-key.json 文件，自行提供七牛云任一可用 bucket 的公钥与私钥

   ```JSON
   {
   	"accessKey": "xxxx",
   	"secretKey": "yyyy"
   }
   ```



2. 安装依赖

```bash
npm install
```



3. **在根目录**启用后台管理，启用 http 服务

```bash
node server 8888
http-server -c-1
```



4. 在命令行提示的网址下打开网站，进入 src 目录，对应路径下打开页面

![移动端页面1.png](https://i.loli.net/2019/03/26/5c9a20f92952c.png)![移动端页面2.png](https://i.loli.net/2019/03/26/5c9a20f827563.png)

![移动端页面3.png](https://i.loli.net/2019/03/26/5c9a20f7ea2b5.png)![移动端页面4.png](https://i.loli.net/2019/03/26/5c9a20f7c21bb.png)

![移动端页面5.png](https://i.loli.net/2019/03/26/5c9a20f85bc0f.png)![移动端页面6.png](https://i.loli.net/2019/03/26/5c9a20f9498f8.png)

---
歌曲管理（可增删修改歌曲，上传动画，管理小精灵可交互完成相关功能）

![管理页面1.png](https://i.loli.net/2019/03/26/5c9a20f80e8fe.png)

---
歌单管理（可增删修改歌单）

![管理页面2.png](https://i.loli.net/2019/03/26/5c9a20f7eef15.png)   