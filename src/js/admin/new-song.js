{
	let view = {
		el: '.newSong',
		template : `新增歌曲`,
		render(data) {
			$(this.el).html(this.template)
		}
	}
	let model = {}
	let controller = {
		init(view, model) {
			this.view = view
			this.model = model
			this.view.render(this.model.data)
			window.eventHub.on('select', () => {
				this.deactive()
			})
			this.active()
			window.eventHub.on('new', () => {
				this.active()
			})
			$(this.view.el).on('click', () => {
				window.eventHub.emit('new')
			})
		},
		active() {
			$(this.view.el).addClass('active')
		},
		deactive() {
			$(this.view.el).removeClass('active')
		}
	}
	controller.init(view, model)
}