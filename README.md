# 项目预览
&nbsp;
https://dantecsm.github.io/music-163/dist/index.html
&nbsp;

# 使用方法
&nbsp;

1. 仓库同目录下的 qiniu-key.json 文件，如果可以的话，请自行提供七牛云任一可用 bucket 的公钥与私钥（不提供也可以，默认用我的账号）

   ```JSON
   {
   	"accessKey": "xxxx",
   	"secretKey": "yyyy"
   }
   ```
&nbsp;

2. 安装依赖

```bash
npm install
```
&nbsp;

3. **根目录下**，依次启用后台管理和 http 服务

```bash
node server 8888
http-server -c-1
```
&nbsp;

4. 对应路径打开页面。应用请在移动端查看(注意将 localhost 替换成 http-server 提示的 ip)，管理页面在 PC 端打开
&nbsp;
- 应用入口：[http://localhost:8080/src/index.html](http://localhost:8080/src/index.html)
- 歌曲管理：[http://localhost:8080/src/admin.html](http://localhost:8080/src/admin.html)
- 歌单管理：[http://localhost:8080/src/admin-playlist.html](http://localhost:8080/src/admin-playlist.html)

![移动端页面1.png][1]![移动端页面2.png][2]

![移动端页面3.png][3]![移动端页面4.png][4]

![移动端页面5.png][5]![移动端页面6.png][6]

---
歌曲管理（歌曲信息增删改查，点击左下角添加本地音乐，点击右下角小精灵预览歌曲）

![管理页面1.png][7]

---
歌单管理（歌单信息增删改查）

![管理页面2.png][8]   



[1]: http://qn.simenchan.xyz/5c9a20f92952c.png
[2]: http://qn.simenchan.xyz/5c9a20f827563.png
[3]: http://qn.simenchan.xyz/5c9a20f7ea2b5.png
[4]: http://qn.simenchan.xyz/5c9a20f7c21bb.png
[5]: http://qn.simenchan.xyz/5c9a20f85bc0f.png
[6]: http://qn.simenchan.xyz/5c9a20f9498f8.png
[7]: http://qn.simenchan.xyz/5c9a20f80e8fe.png
[8]: http://qn.simenchan.xyz/5c9a20f7eef15.png





