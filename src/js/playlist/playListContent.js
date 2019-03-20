{
  let view = {
    el: 'section.playListContent',
    template: `
      <h3>歌曲列表</h3>
      <ul class="songList"></ul>
    `,
    liTemplate: `
      <li>
	      <a href="./song.html?id=__songId__">
	        <div class="order">__order__</div>
	        <div class="songMsg">
	          <h2>__songName__</h2>
	          <p>__singer__</p>
	        </div>
	        <div class="iconPlay">
	          <svg class="icon" aria-hidden="true">
	            <use xlink:href="#icon-bofang"></use>
	          </svg>
	        </div>
	      </a>
	    </li>
    `,
    render(data) {
			let {list} = data
			let $liList = list.map((obj, idx) => {
				let li = this.liTemplate
				let {songId, songName, singer} = obj
				li = li.replace('__order__', idx + 1)
				li = li.replace('__songId__', songId)
				li = li.replace('__songName__', songName)
				li = li.replace('__singer__', singer)
				return $(li)
			})

			$(this.el).html(this.template).find('ul.songList').append($liList)
    }
  }
  let model = {
    data: {
    	list: []
    },
    init() {
    	let id = this.getId()
    	let cql = `select * from Song where objectId in (select song.objectId from SongListSongMap where songList = pointer("SongLists", "${id}"))`
      return AV.Query.doCloudQuery(cql).then(data => {
        this.data.list = data.results.map(r => {
          return {songId: r.id, songName: r.attributes.song, singer: r.attributes.singer}
        })
      })
    },
    getId() {
    	let hash = {}
			window.location.search.substr(1).split('&').filter(v => v).map(v => hash[v.split('=')[0]] = v.split('=')[1])
			return hash['id']
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.model.init().then(() => {
	      this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
}