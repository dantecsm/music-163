{
  let view = {
    el: 'header',
    template: `
    <div class="frostedBg" style="background-image: url('__cover__')"></div>
    <div class="playListHead">
      <div class="playListCover">
        <img src="__cover__" alt="">
      </div>
      <div class="playListMsg">
        <h2>__title__</h2>
        <a href="javascript:;">
          <div class="avator">
            <img src="__avator__" alt="">
          </div>
          __name__
        </a>
      </div>
    </div>
    `,
    render(data) {
    	let {cover, title, uploader} = data
    	let {name, avator} = uploader
    	let html = this.template

  		html = html.replace('__cover__', cover || 'https://i.loli.net/2017/08/22/599ba7a0aea8b.jpg')
  		html = html.replace('__cover__', cover || 'https://i.loli.net/2017/08/22/599ba7a0aea8b.jpg')
  		html = html.replace('__title__', title || '')
  		html = html.replace('__name__', name || '')
  		html = html.replace('__avator__', avator)
    	$(this.el).html(html)
    }
  }
  let model = {
    data: {
    	cover: '',
    	title: '',
    	uploader: {
    		name: '',
    		avator: ''
    	}
    },
    init() {
    	let id = this.getId()
    	let songLists = new AV.Query('SongLists')
			return songLists.get(id).then(item => {
				this.data.cover = item.attributes.cover
				this.data.title = item.attributes.songListName
				return item.attributes.uploader
			}).then(uploader => {
        let query = new AV.Query('Users')
        return query.get(uploader.id).then(user => {
          this.data.uploader = {name: user.attributes.name, avator: user.attributes.avator}
          return this.data
        })
      });
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
      this.model.init().then(data => {
	      this.view.render(data)
      })
    }
  }
  controller.init(view, model)
}