{
  let view = {
    el: '.loading',
    show() {
    	$(this.el).addClass('active')
    },
    hide() {
    	$(this.el).removeClass('active')
    }
  }
  let model = {}
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.bindEventHub()
    },
    bindEventHub() {
    	window.eventHub.on('startLoading', () => {
    		this.view.show()
    	})
    	window.eventHub.on('stopLoading', () => {
    		this.view.hide()
    	})
    }
  }
  controller.init(view, model)
}