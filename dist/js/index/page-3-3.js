{
  let view = {
    el: 'section.recentModule',
    template: `
    <li>
      <div class="wait-icon" aria-hidden="true">
        <svg class="icon">
          <use xlink:href="#icon-wait"></use>
        </svg>
      </div>
      <p>__string__</p>
      <div class="delete-icon" aria-hidden="true">
        <svg class="icon">
          <use xlink:href="#icon-delete"></use>
        </svg>
      </div>
    </li>
    `,
    render(data) {
    	let list = data.list
    	let $liList = list.map(string => {
    		let li = this.template
    		li = li.replace('__string__', string)
    		return $(li)
    	})
    	let $ul = $(`<ul class="recentList"></ul>`).append($liList)
    	$(this.el).empty().append($ul)
    }
  }
  let model = {
    data: {
    	list: []
    },
    init() {
    	this.data.list = window.historyStorage.fetch().splice(0, 10)
    },
    delete(data) {
    	window.historyStorage.delete(data)
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.model.init()
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents() {
    	$(this.view.el).on('click', 'li p', e => {
    		let text = $(e.currentTarget).text()
    		window.eventHub.emit('search', text)
    	})
    	$(this.view.el).on('click', 'li .delete-icon', e => {
    		let text = $(e.currentTarget).siblings('p').text()
    		this.model.delete(text)
    		this.model.init()
	      this.view.render(this.model.data)
    	})
    },
    bindEventHub() {
    	window.eventHub.on('showRecent', () => {
    		this.model.init()
	      this.view.render(this.model.data)
    		$(this.view.el).addClass('active')
    	})
    	window.eventHub.on('hideRecent', () => {
    		$(this.view.el).removeClass('active')
    	})
    }
  }
  controller.init(view, model)
}