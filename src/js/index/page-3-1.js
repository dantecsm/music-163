{
  let view = {
    el: 'section.searchModule',
    template: `
    <form action="">
			<div class="row">
				<input class="search" name="search" type="text" placeholder="搜索歌手、歌曲、专辑">
				<div class="search-icon" aria-hidden="true">
					<svg class="icon">
						<use xlink:href="#icon-search"></use>
					</svg>
				</div>
			</div>
		</form>
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
    }
  }

  controller.init(view, model)
}