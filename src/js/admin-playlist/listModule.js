{
  let view = {
    el: '.listModule',
    template: `
    <ul class="songLists"></ul>
    <div class="newListBtn">新建歌单</div>
    `,
    render(data = {}) {
    	let {lists} = data
    	let $liList = lists.map(list => {
    		let $li = $('<li></li>')
    		$li.html(`<div>${list.songListName}</div>`)
    		$li.attr('data-songList-id', list.id)
    		return $li
    	})

    	$(this.el).html(this.template)
    	$(this.el).find('ul.songLists').append($liList)
    }
  }
  let model = {
    data: {
    	lists: []
    },
    fetch() {
    	var songLists = new AV.Query('SongLists')
    	return songLists.find().then(songLists => {
    		return this.data.lists = songLists.map(songList => {
    			return {id: songList.id, ...songList.attributes}
    		})
    	})
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.reload()
      this.bindEvents()
      this.bidnEventHub()
    },
    reload() {
    	this.model.fetch().then(data => {
    		this.view.render(this.model.data)
    	})
    },
    bindEvents() {
    	$(this.view.el).on('click', '.newListBtn', () => {
    		this.clearActive()
    		window.eventHub.emit('createSongList')
    	})
    	$(this.view.el).on('click', 'li', e => {
    		let $li = $(e.currentTarget)
    		$li.addClass('active').siblings('.active').removeClass('active')

            let data = {}
            let lists = this.model.data.lists
            let id = $li.attr('data-songList-id')
            for(let i=0; i<lists.length; i++) {
                if(id === lists[i].id) {
                    data = JSON.parse(JSON.stringify(lists[i]))
                    break
                }
            }
    		window.eventHub.emit('selectSongList', data)
    	})
    },
    bidnEventHub() {
        window.eventHub.on('reloadSongList', () => {
            this.reload()
        })
    },
    clearActive() {
    	$(this.view.el).find('li').removeClass('active')
    }
  }
  controller.init(view, model)
}