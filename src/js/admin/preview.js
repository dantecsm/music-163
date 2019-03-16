{
  let view = {
    el: '.page >preview'
  }
  let model = {
    data: {},
  }

  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents() {
    	$(this.view.el).on('click', '.spirit', e => {
    		let audio = $('audio')[0]
			  let src = audio.src
			  let formSrc = $(`[name="url"]`).val()

			  if(src !== formSrc) {
			  	audio.src = formSrc
			  	src && audio.play()
			  }
			  audio.paused? audio.play(): audio.pause()
			  audio.paused? $(e.currentTarget).removeClass('active'): $(e.currentTarget).addClass('active')
			})
    },
    bindEventHub() {
    	window.eventHub.on('select', data => {
    		let audio = $('audio')[0]
    		let playing = !audio.paused
    		
    		audio.src = data.url
    		playing? audio.play(): audio.pause()
    	})
    }
  }
  controller.init(view, model)
}