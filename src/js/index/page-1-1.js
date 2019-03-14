{
  // view
  let view = {
    el: '.xxx',
    template: ``,
    render(data = {}) {}
  }

  // model
  let model = {
    data: {},
    init() {},
    fetch() {},
    save() {}
  }

  // controller
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.model.init()
      this.view.render(this.model.data)
    }
  }

  // boot mvc
  controller.init(view, model)
}