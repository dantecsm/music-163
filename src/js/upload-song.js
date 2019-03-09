{
	let view = {
		el: '.uploadArea',
		find(selector) {
			return $(this.el).find(selector)[0]
		}
	}
	let model = {}
	let controller = {
		init(view, model) {
			this.view = view
			this.model = model
			this.initQiniu()
		},
		initQiniu() {
			var uploader = Qiniu.uploader({
			runtimes: 'html5',
			browse_button: this.view.find('#uploadButton'),
			uptoken_url: 'http://localhost:8888/uptoken',
			domain: 'http://simenchan.xyz',
			get_new_uptoken: false,
			max_file_size: '40mb',
			dragdrop: true,
			drop_element: this.view.find('#uploadButton'),
			auto_start: true,
			init: {
				'FilesAdded': function(up, files) {
	                // 文件添加进队列后，处理相关的事情
	            },
	            'BeforeUpload': function(up, file) {
	                // 每个文件上传前，处理相关的事情
	                // window.eventHub.emit('beforeUpload')
	            },
	            'UploadProgress': function(up, file) {
	                // 每个文件上传时，处理相关的事情
	                window.eventHub.emit('new')
	                uploadStatus.innerText = '上传中'
	            },
	            'UploadComplete': function() {
	                // 
	            },
	            'FileUploaded': function(up, file, info) {
	            	// window.eventHub.emit('afterUpload')

	                var domain = up.getOption('domain')
	                var response = JSON.parse(info.response)
	                var song = response.key
	                var url = domain + '/' + encodeURIComponent(response.key)
	                uploadStatus.innerText = url

	                var obj = {song, url}

	                window.eventHub.emit('new', obj)
	            },
	            'Error': function(up, err, errTip) {
	                // 
	                console.log('上传错误', err)
	            }
	        }
	    });
		}
	}
	controller.init(view, model)
}