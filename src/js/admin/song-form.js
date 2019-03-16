{
	let view = {
		el: '.page >main',
		template: `
			<div class="form-wrapper">
				<form action="post">
					<div class="row">
						<label for="">歌曲</label>
					<input type="text" name="song" value="__song__">
					</div>
					<div class="row">
						<label for="">歌手</label>
						<input name="singer" type="text" value="__singer__">
					</div>
					<div class="row">
						<label for="">外链</label>
						<input name="url" type="text" value="__url__">
					</div>
					<div class="row">
						<label for="">封面</label>
						<input name="cover" type="text" value="__cover__">
						<div class="coverBtn">
							<input name="coverUp" type="file" />
						</div>
					</div>
					<div class="row">
						<label for="">歌词</label>
						<textarea cols=50 rows=10 name="lyric" type="text">__lyric__</textarea>
					</div>
					<div class="row action">
						<input id="songFormCoverUp" type="button" value="选择封面">
						<input id="songFormLyricUp" type="button" value="选择歌词">
						<input id="songFormSav" type="submit" value="保存">
						<input id="songFormDel" type="button" value="删除">
					</div>
				</form>
			</div>
		`,
		render(data = {}) {
			let html = this.template
			let placeHolders = ['song', 'singer', 'url', 'id', 'cover', 'lyric']
			placeHolders.map(string => {
				html = html.replace(`__${string}__`, data[string] || '')
			})
			$(this.el).html(html)
			if(data.id) {
				$(this.el).prepend('<h1>编辑歌曲</h1>')
			} else {
				$(this.el).prepend('<h1>新增歌曲</h1>')
			}
		},
		reset() {
			this.render({})
		}
	}

	let model = {
		data : {
			song: '', singer: '', url: '', id: '', cover: '', lyric: ''
		},
		create(data) {
			var NewSong = AV.Object.extend('Song');
			var newSong = new NewSong();
			newSong.set('song', data.song);
			newSong.set('singer', data.singer);
			newSong.set('url', data.url)
			newSong.set('cover', data.cover)
			newSong.set('lyric', data.lyric)
			return newSong.save().then(obj => {
				let {id, attributes} = obj
				this.data = {id, ...attributes}
			});
		},
		update(data) {
			var song = AV.Object.createWithoutData('Song', this.data.id)
			song.set('singer', data.singer)
			song.set('song', data.song)
			song.set('url', data.url)
			song.set('cover', data.cover)
			song.set('lyric', data.lyric)
			return song.save().then(response => {
				Object.assign(this.data, data)
				return response
			})
		}
	}

	let controller = {
		init(view, model) {
			this.view = view
			this.model = model
			this.view.render(this.model.data)
			this.bindEvents()
			this.bindEventHub()
		},
		create() {
			let needs = 'singer song url cover lyric'.split(' ')
			let data = {}
			needs.map(string => {
				data[string] = $(this.view.el).find(`[name=${string}]`).val()
			})
			this.model.create(data).then(() => {
				this.view.reset()
				window.eventHub.emit('create', this.model.data)
			})
		},
		update() {
			let needs = 'singer song url cover lyric'.split(' ')
			let data = {}
			needs.map(string => {
				data[string] = $(this.view.el).find(`[name=${string}]`).val()
			})
			this.model.update(data).then(() => {
				alert('更新成功！')
				window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data)))
			})
		},
		delete() {
			console.log('尝试删除 ' + this.model.data.id)

			var song = AV.Object.createWithoutData('Song', this.model.data.id)
			song.destroy().then(function (success) {
				console.log('删除成功')
			}).then(() => {
				window.eventHub.emit('delete', this.model.data)
				this.model.data = {}
				window.eventHub.emit('new')
			})
		},
		bindEvents() {
			$(this.view.el).on('submit', 'form', e => {
				e.preventDefault()

				if(this.model.data.id) {
					this.update()
				} else {
					this.create()
				}
			})
			$(this.view.el).on('click', '#songFormDel', e => {
				e.preventDefault()
				
				if(this.model.data.id) {
					this.delete()
				} else {
					alert('请选择一首歌曲')
				}
			})
			$(this.view.el).on('click', '#songFormCoverUp', e => {
				e.preventDefault()
				
				window.eventHub.emit('uploadCover')
				
			})
			$(this.view.el).on('click', '#songFormLyricUp', e => {
				e.preventDefault()
				
				window.eventHub.emit('uploadLyric')
				
			})
		},
		bindEventHub() {
			window.eventHub.on('select', data => {
				this.model.data = data
				this.view.render(data)
			})
			window.eventHub.on('new', data => {
				if(!this.model.data.id) {
					Object.assign(this.model.data, data)
				} else {
					this.model.data = {song: '', singer: '', url: '', id: '', cover: '', lyric: ''}
				}
				this.view.render(this.model.data)
			})
			window.eventHub.on('fillCover', string => {
				$(this.view.el).find(`[name="cover"]`).val(string)
			})
			window.eventHub.on('fillLyric', string => {
				$(this.view.el).find(`[name="lyric"]`).val(string)
			})
		}
	}

	controller.init(view, model)
}