{
  let view = {
    el: '.page-2',
    template: `
      <li>
        <a class="songItem" href="./song.html?id={{songId}}">
          <div class="songMsg">
            <h3>{{songName}}</h3>
            <p>{{songSinger}}</p>
          </div>
          <div class="logo">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-bofang"></use>
            </svg>
          </div>
        </a>
      </li>
    `,
    render(data = []) {
      let $liList = data.map(song => {
        let li = this.template
        li = li.replace('{{songId}}', song.id)
        li = li.replace('{{songName}}', song.song)
        li = li.replace('{{songSinger}}', song.singer)
        return $(li)
      })
      $(this.el).find('.songList').append($liList)
    },
    init() {
    	this.$el = $(this.el)
    },
    show() {
    	this.$el.addClass('active')
      $('.tabs').addClass('page2')
    },
    hide() {
    	this.$el.removeClass('active')
      $('.tabs').removeClass('page2')
    }
  }
  let model = {
    data: {
      songs: []
    },
    fetch() {
      var song = new AV.Query('Song');
      return song.find().then(songs => {
        this.data.songs = songs.map(song => {return {id: song.id, ...song.attributes}})
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.init()
      this.bindEventHub()
      this.model.fetch().then(() => {
        this.view.render(this.model.data.songs)
      })
    },
    bindEventHub() {
      window.eventHub.on('selectTab', tabName => {
        tabName === 'page-2'? this.view.show(): this.view.hide()
      })
    }
  }
  controller.init(view, model)
}