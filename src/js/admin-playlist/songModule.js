{
  let view = {
    el: '.songModule',
    template: `<ul class="songs"></ul>`,
    render(data = {}) {
    	let {lists, status} = data
    	let className = status === 'showListedSongs'? 'listedSongs': 'unListedSongs'
    	let $liList = lists.map(list => {
    		return $(`
    			<li class=${className} data-song-id=${list.id}>
	    			<p>${list.name}</p>
	    			<div class="icon">
		    			<div class="add">+</div>
		    			<div class="remove">x</div>
	    			</div>
    			</li>
    		`)
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
    		$(e.currentTarget).addClass('active').siblings('.active').removeClass('active')
    	})
    	$(this.view.el).on('click', '.add', e => {
    		let $li = $(e.currentTarget).closest('li')
    		let songId = $li.attr('data-song-id')
				let song = AV.Object.createWithoutData('Song', songId)
				let songList = AV.Object.createWithoutData('SongLists', this.model.data.songListId)
				song.set('in', songList)
				song.save().then(() => {
					alert('成功添加歌曲到歌单')
					this.reload()
				})
    	})
    	$(this.view.el).on('click', '.remove', e => {
    		let $li = $(e.currentTarget).closest('li')
    		let songId = $li.attr('data-song-id')
				let song = AV.Object.createWithoutData('Song', songId)
				let songList = AV.Object.createWithoutData('SongLists', this.model.data.songListId)
				song.set('in', null)
				song.save().then(() => {
					alert('成功从歌单移除歌曲')
					this.reload()
				})
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