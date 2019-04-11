{
	let view = {
		el: '.songList',
		template: `
			<ul>
			</ul>
		`,
		render(data) {
			$(this.el).html(this.template)
			$(this.el).find('ul').empty()
			let $liList = data.filter(song => !!song.song)
			.map(song => $(`<li><div data-id=${song.id}>${song.song}</div></li>`))
			$(this.el).find('ul').append($liList)
		},
		activeItem(li) {
			$(li).addClass('active').siblings('.active').removeClass('active')
		}
	}

	let model = {
		data: {
			songs: [],			
		},
		fetch() {
			var song = new AV.Query('Song');
			return song.find().then(songs => {
				this.data.songs = songs.map(song => {return {id: song.id, ...song.attributes}})
			})
		}
	}

	let controller = {
		init(view, model) {
			this.view = view
			this.model = model
			this.view.render(this.model.data.songs)
			this.getAllSongs()
			this.bindEvents()
			this.bindEventHub()
		},
		bindEvents() {
			$(this.view.el).on('click', 'li', e => {
				this.view.activeItem(e.currentTarget)
				let id = $(e.currentTarget).find('[data-id]').attr('data-id')
				let data
				let songs = this.model.data.songs
				for(let i=0; i<songs.length; i++) {
					if(songs[i].id === id) {
						data = JSON.parse(JSON.stringify(songs[i]))
					}
				}
				window.eventHub.emit('select', data)
			})
		},
		bindEventHub() {
			window.eventHub.on('create', song => {
				this.model.data.songs.push(song)
				this.view.render(this.model.data.songs)
			})
			window.eventHub.on('delete', song => {
				let songs = this.model.data.songs
				for(let i=0; i<songs.length; i++) {
					if(songs[i].id === song.id) {
						songs.splice(i, 1)
					}
				}
				this.view.render(songs)
			})
			window.eventHub.on('new', () => {
				this.clearActive()
			})
			window.eventHub.on('update', song => {
				let songs = this.model.data.songs
				for(let i=0; i<songs.length; i++) {
					if(songs[i].id === song.id) {
						Object.assign(songs[i], song)
					}
				}
				this.view.render(this.model.data.songs)
				this.view.activeItem($(`[data-id=${song.id}]`)[0].parentNode)
			})
		},
		getAllSongs() {
			this.model.fetch().then(() => this.view.render(this.model.data.songs))
		},
		clearActive() {
			$(this.view.el).find('.active').removeClass('active')
		}
	}

	controller.init(view, model)
}