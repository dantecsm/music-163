{
  let view = {
    el: '.page-2',
    init() {
    	this.$el = $(this.el)
    },
    show() {
    	this.$el.addClass('active')
    },
    hide() {
    	this.$el.removeClass('active')
    }
  }
  let model = {}
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.init()
      this.bindEventHub()
    },
    bindEventHub() {
    	window.eventHub.on('selectTab', tabName => {
    		tabName === 'page-2'? this.view.show(): this.view.hide()
    	})
    }
  }
  controller.init(view, model)
}