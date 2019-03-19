{
  let view = {
    el: '#app',
    render(data) {
    	let {song, status} = data
    	
    	let array = song.lyric.split('\n').map(string => {
    		let regExp = /(\[[\d:.]+\])(.+)/
    		let matches = string.match(regExp)
    		let time = '[00:00.00]', line = string
    		if(matches) {
    			time = matches[1]
    			line = matches[2]
    			time = time.substr(1)
    			let min = parseInt(time.split(':')[0], 10)
    			let sec = parseFloat(time.split(':')[1])
    			time = min * 60 + sec
    			return $(`<p class="line" data-time=${time}>${line}</p>`)
    		} else {
    			return $(``)
    		}
    	})
    	$('.lyric .lines').append(array)

    	song.cover = song.cover || './img/disc_default.png'
        $(this.el).find('.pageBackground').css({'background-image': `url(${song.cover})`})
    	$(this.el).find('.cover').css({'background-image': `url(${song.cover})`})
    	$(this.el).find('.song-description h1').text(song.song)
    	let audio = $(this.el).find('audio')[0]
    	if(audio.src !== song.url) {
	    	audio.src = song.url
	    	audio.onended = () => {window.eventHub.emit('end')}
	    	audio.ontimeupdate = () => {this.showLiric(audio.currentTime)}
    	}
    	if(status === 'playing') {
	    	$(this.el).find('.disc-container').addClass('playing')
    	} else {
    		$(this.el).find('.disc-container').removeClass('playing')
    	}
    },
    showLiric(currentTime) {
    	let lines = $('.line')
    	let i = 0
    	for(; i<lines.length; i++) {
    		let time = parseFloat($(lines[i]).attr('data-time'))
    		if(time >= currentTime) {
    			break
    		}
    	}

    	let index = i-1>=0? i-1:0
    	let distance = -lines.height() * index + lines.height()
    	lines.eq(index).addClass('active').siblings('.active').removeClass('active')
    	$('.lines').css({transform: `translateY(${distance}px)`})
    },
    play() {
    	$(this.el).find('audio')[0].play()
    },
    pause() {
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
	    	this.bindEvents()
      })
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
    		this.view.render(this.model.data)
    		window.eventHub.on('end', () => {
    			this.model.data.status = 'paused'
    			this.view.render(this.model.data)
    		})
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