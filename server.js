var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
var qiniu = require('qiniu')

if(!port){
  console.log('请指定端口号\nnode server.js 8888')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url 
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看 ************/

  console.log('含查询字符串的路径\n' + pathWithQuery)

  if(path==='/uptoken'){
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/json;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.removeHeader('Date')

    var config = JSON.parse(fs.readFileSync('./qiniu-key.json'))

    let {accessKey, secretKey} = config;
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var options = {
      scope: 'music-bed',
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken=putPolicy.uploadToken(mac);
    response.write(`
    {
      "uptoken": "${uploadToken}"
    }
    `)
    response.end()
  }else{
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.end()
  }

  /******** 代码结束 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功, 请打开 http://localhost:' + port)

