{
  let view = {
    el: 'section.hotModule',
    template: `
    <h6>热门搜索</h6>
    <ul class="tagBox">
      <li class="tag">张艺兴远东韵律</li>
      <li class="tag">有一种悲伤</li>
      <li class="tag">起风了</li>
      <li class="tag">绿色</li>
      <li class="tag">只是太爱你</li>
      <li class="tag">董又霖就喜欢你</li>
      <li class="tag">以团之名</li>
      <li class="tag">我曾</li>
      <li class="tag">告白之夜</li>
      <li class="tag">阿丽塔</li>
    </ul>
    `,
    render(data = {}) {
    	$(this.el).html(this.template)
    }
  }
  let model = {
    data: {},
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents() {
      $(this.view.el).on('click', 'li', e => {
        let text = $(e.currentTarget).text()
        window.eventHub.emit('search', text)
      })
    },
    bindEventHub() {
      window.eventHub.on('showHot', () => {
        $(this.view.el).addClass('active')
      })
      window.eventHub.on('hideHot', () => {
        $(this.view.el).removeClass('active')
      })
    }
  }
  controller.init(view, model)
}