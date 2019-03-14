{
  let view = {
    el: '#app',
    render(data) {
    	let {song} = data
    	$(this.el).find('.pageBackground').css({'background-image': `url('https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1552525802&di=38d0e9423ac6815c93ccb51681927b44&src=http://5b0988e595225.cdn.sohucs.com/q_mini,c_zoom,w_640/images/20171103/59ffde6df57c4f3ebd9058d246c5f041.jpeg')`})
    	$(this.el).find('.cover').attr('src', song.cover)
    	$(this.el).find('audio').attr('src', song.url)
    },
    play() {
    	$(this.el).find('.disc-container').addClass('playing')
    	$(this.el).find('audio')[0].play()
    },
    pause() {
    	$(this.el).find('.disc-container').removeClass('playing')
    	$(this.el).find('audio')[0].pause()
    }
  }
  let model = {
    data: {
    	song: {
				id: '',
				song: '',
				singer: '',
				url: '',
				cover: ''
    	},
    	status: 'paused'
    },
    fetch(id) {
			var song = new AV.Query('Song')
			return song.get(id).then(item => {
				this.data.song = {id, ...item.attributes}
				return this.data
			});
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      let id = this.getSongId()
      this.model.fetch(id).then(data => {
      	this.view.render(this.model.data)
      })
    	this.bindEvents()
    },
    bindEvents() {
    	$(this.view.el).on('click', '.icon-wrapper', () => {
    		if(this.model.data.status === 'paused') {
    			this.model.data.status = 'playing'
    			this.view.play()
    		} else {
    			this.model.data.status = 'paused'
    			this.view.pause()
    		}
    	})
    },
    getSongId() {
    	let hash = {}
			window.location.search.substr(1).split('&').filter(v => v).map(v => hash[v.split('=')[0]] = v.split('=')[1])
			return hash['id']
    }
  }
  controller.init(view, model)
}