{
  let view = {
    el: '.songModule',
    template: `
    <ul class="songs"></ul>
    `,
    render(data = {}) {
    	let {lists} = data
    	let $liList = lists.map(list => {
    		let $li = $('<li></li>')
    		$li.text(list.name)
    		$li.attr('data-song-id', list.id)
    		return $li
    	})

    	$(this.el).html(this.template)
    	$(this.el).find('ul.songs').append($liList)
    }
  }
  let model = {
    data: {
    	lists: [],
    	status: '',
    	songListId: ''
    },
    fetch(where, id) {
  		let songList = AV.Object.createWithoutData('SongLists', id)
  		let query = new AV.Query('Song')
  		query[where]('in', songList)
  		return query.find().then(songs => {
  			this.data.lists = songs.map(song => {
  				return {id: song.id, name: song.attributes.song}
  			})
  			console.log(this.data.lists)
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
    bindEvents() {
    	$(this.view.el).on('click', 'li', e => {
    		$(e.target).addClass('active').siblings('.active').removeClass('active')
    	})
    },
    bindEventHub() {
    	window.eventHub.on('showListedSongs', songListId => {
    		this.model.data.status = 'showListedSongs'
    		this.model.data.songListId = songListId
    		this.reload()
    	})
    	window.eventHub.on('showUnListedSongs', songListId => {
    		this.model.data.status = 'showUnListedSongs'
    		this.model.data.songListId = songListId
    		this.reload()
    	})
    },
    reload() {
    	let {status, songListId} = this.model.data
    	let where = status === 'showListedSongs'? 'equalTo': 'notEqualTo'

    	this.model.fetch(where, songListId).then(() => {
    		this.view.render(this.model.data)
    	})
    }
  }
  controller.init(view, model)
}