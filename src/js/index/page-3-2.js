{
  let view = {
    el: 'section.hotModule',
    template: `
    <h6>热门搜索</h6>
    <ul class="tagBox">
      <li class="tag"><a href="javascript:;">张艺兴远东韵律</a></li>
      <li class="tag"><a href="javascript:;">吴青峰蜂鸟</a></li>
      <li class="tag"><a href="javascript:;">董又霖就喜欢你</a></li>
      <li class="tag"><a href="javascript:;">有一种悲伤</a></li>
      <li class="tag"><a href="javascript:;">绿色</a></li>
      <li class="tag"><a href="javascript:;">以团之名</a></li>
      <li class="tag"><a href="javascript:;">起风了</a></li>
      <li class="tag"><a href="javascript:;">我曾</a></li>
      <li class="tag"><a href="javascript:;">告白之夜</a></li>
      <li class="tag"><a href="javascript:;">阿丽塔</a></li>
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
      this.bindEventHub()
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