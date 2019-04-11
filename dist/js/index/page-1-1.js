{
  let view = {
    el: '.recommendSongs',
    render(data) {
      let list = data.list || []
      let $liList = list.filter(obj => obj.songListName).splice(0, 6)
      .map(obj => {
        return $(`
          <li class="songCover">
            <a href="./playlist.html?id=${obj.id}">
              <img src=${obj.cover || "https://i.loli.net/2017/08/22/599ba7a0aea8b.jpg"}>
              <p>${obj.songListName}</p>
            </a>
          </li>
        `)
      })
      $(this.el).append($liList)
    }
  }
  let model = {
    data: {
      list: []
    },
    init() {
      var songLists = new AV.Query('SongLists')
      return songLists.find().then(arr => {
        this.data.list = arr.map(songList => {return {id: songList.id, ...songList.attributes}})
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.model.init().then(() => {
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
}