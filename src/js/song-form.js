{
	let view = {
		el: '.page >main',
		template: `
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
				<div class="row action">
					<input type="submit" value="保存">
				</div>
			</form>
		`,
		render(data = {}) {
			let html = this.template
			let placeHolders = ['song', 'singer', 'url', 'id']
			placeHolders.map(string => html = html.replace(`__${string}__`, data[string] || ''))
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
			song: '', singer: '', url: '', id: ''
		},
		create(data) {
			var NewSong = AV.Object.extend('Song');
			var newSong = new NewSong();
			newSong.set('song', data.song);
			newSong.set('singer', data.singer);
			newSong.set('url', data.url)
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
			let needs = 'singer song url'.split(' ')
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
			let needs = 'singer song url'.split(' ')
			let data = {}
			needs.map(string => {
				data[string] = $(this.view.el).find(`[name=${string}]`).val()
			})
			this.model.update(data).then(() => {
				alert('更新成功！')
				window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data)))
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
					this.model.data = {song: '', singer: '', url: '', id: ''}
				}
				this.view.render(this.model.data)
			})
		}
	}

	controller.init(view, model)
}