{
  let view = {
    el: '.newestSongs',
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
    	$(this.el).append($liList)
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
      window.eventHub.emit('startLoading')
      this.model.fetch().then(() => {
      	window.eventHub.emit('stopLoading')
      	this.view.render(this.model.data.songs)
      })
    }
  }
  controller.init(view, model)
}