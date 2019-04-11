{
  let view = {
    el: '.page-3',
    init() {
    	this.$el = $(this.el)
    },
    show() {
    	this.$el.addClass('active')
      window.eventHub.emit('focusInput')
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
      this.loadModule('./js/index/page-3-1.js')
      this.loadModule('./js/index/page-3-2.js')
      this.loadModule('./js/index/page-3-3.js')
    },
    bindEventHub() {
    	window.eventHub.on('selectTab', tabName => {
    		tabName === 'page-3'? this.view.show(): this.view.hide()
    	})
    },
    loadModule(src) {
      let script = document.createElement('script')
      script.src = src
      script.onload = () => {console.log(src + ' 加载完毕')}
      document.body.append(script)
    }
  }
  controller.init(view, model)
}