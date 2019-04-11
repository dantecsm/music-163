{
  let view = {
    el: '.tabs',
    init() {
    	this.$el = $(this.el)
    }
  }
  let model = {}
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.init()
      this.bindEvents()
    },
    bindEvents() {
    	this.view.$el.on('click', 'li', e => {
    		let $li = $(e.currentTarget)
    		let tabName = $li.attr('data-tab-name')
    		$li.addClass('active').siblings('.active').removeClass('active')
    		window.eventHub.emit('selectTab', tabName)
    	})
    }
  }
  controller.init(view, model)
}