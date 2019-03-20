// {
  let view = {
    el: 'section.playListIntro',
    template: `
      <div class="tagList">
        标签：__tagList__
      </div>
      <div class="intro">
        <div class="content f-thide3">__resume__</div>
        <div class="arrow arrowDown">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-arrow"></use>
          </svg>
        </div>
      </div>
    `,
    render(data) {
    	let {tagList, resume} = data
    	let html = this.template

    	let tags = tagList.map(tag => tag && `<em>${tag}</em>`)
      let el = tags.length !== 0? tags.join(''): '未添加'
    	html = html.replace('__tagList__', el)

    	resume = '简介:' + resume
    	let spanList = resume.split('\n').map(line => `<span><i>${line}</i><br></span>`)
    	html = html.replace('__resume__', spanList.join(''))
    	$(this.el).html(html)
    }
  }
  let model = {
    data: {
    	tagList: [],
    	resume: ''
    },
    init() {
    	let id = this.getId()
    	let songLists = new AV.Query('SongLists')
			return songLists.get(id).then(item => {
        let tagList = item.attributes.tagList
        
				this.data.tagList = tagList? tagList.split(' '): []
				this.data.resume = item.attributes.resume
				return this.data
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
      this.bindEvents()
    },
    bindEvents() {
    	$(this.view.el).on('click', '.arrowDown', e => {
    		$(e.currentTarget).removeClass('arrowDown').addClass('arrowUp')
    		$(e.currentTarget).siblings('.content').removeClass('f-thide3')
    	})
    	$(this.view.el).on('click', '.arrowUp', e => {
    		$(e.currentTarget).removeClass('arrowUp').addClass('arrowDown')
    		$(e.currentTarget).siblings('.content').addClass('f-thide3')
    	})
    }
  }
  controller.init(view, model)
// }