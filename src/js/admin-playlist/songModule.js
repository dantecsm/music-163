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
  		let query = new AV.Query('SongListSongMap')
      query.include('song')
  		query[where]('songList', songList)
  		return query.find().then(rels => {
  			this.data.lists = rels.map(rel => {
          return {id: rel.get('song').id, name: rel.get('song').attributes.song}
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
        let songListId = this.model.data.songListId
				
        let song = AV.Object.createWithoutData('Song', songId)
				let songList = AV.Object.createWithoutData('SongLists', songListId)
        let songListSongMap = new AV.Object('SongListSongMap')
        songListSongMap.set('song', song)
        songListSongMap.set('songList', songList)

				songListSongMap.save().then(() => {
					alert('成功添加歌曲到歌单')
					this.reload()
				})
    	})
    	$(this.view.el).on('click', '.remove', e => {
    		let $li = $(e.currentTarget).closest('li')
        let songId = $li.attr('data-song-id')
        let songListId = this.model.data.songListId

        let q1 = `select * from SongListSongMap where songList = pointer("SongLists", "${songListId}") and song = pointer("Song", "${songId}")`
        
        AV.Query.doCloudQuery(q1).then((data) => {
          let q2 = `delete from SongListSongMap where objectId = "${data.results[0].id}"`
          
          AV.Query.doCloudQuery(q2).then(() => {
            alert('成功从歌单中删除歌曲')
            this.reload()
          })
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
    	let where = status === 'showListedSongs'? 'in': 'not in'

      let cql = `select song from Song where objectId ${where} (
        select song.objectId from SongListSongMap where songList = pointer("SongLists", "${songListId}"))`
      AV.Query.doCloudQuery(cql).then(data => {
        console.log(status)
        console.log(data.results)
        this.model.data.lists = data.results.map(r => {
          return {id: r.id, name: r.attributes.song}
        })
        this.view.render(this.model.data)
      })


    	// this.model.fetch(where, songListId).then(() => {
    	// 	this.view.render(this.model.data)
    	// })
    }
  }
  controller.init(view, model)
}