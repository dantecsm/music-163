{
  let view = {
    el: '.formModule',
    template: `
    <h2>__mode__</h2>
    <form action="">
      <div class="row">
        <label for="">歌单名称</label>
        <input name="songListName" type="text" value="__songListName__">
      </div>
      <div class="row">
        <label for="">歌单标签</label>
        <input name="tagList" type="text" value="__tagList__">
      </div>
      <div class="row">
        <label for="">歌单封面</label>
        <input name="cover" type="text" value=__cover__>
        <input name="coverUp" id="coverUpBtn" type="button" value="···">
      </div>
      <div class="row">
        <label for="">歌单简介</label>
        <textarea name="resume" cols=50 rows=10>__resume__</textarea>
      </div>
      <div class="row action">
        <input name="songListSav" type="submit" value="保存">
        <input name="songListDel" type="button" value="删除">
        <input name="showListedSongs" type="button" value="显示歌曲">
        <input name="showUnListedSongs" type="button" value="添加歌曲">
      </div>
    </form>
    `,
    render(data) {
		let {formData, status} = data
    	let html = this.template
		let needs = 'songListName tagList cover resume'
		needs.split(' ').map(string => {
			html = html.replace(`__${string}__`, formData[string] || '')
		})
		html = html.replace(`__mode__`, status === 'creating'? '创建歌单': '编辑歌单')
		$(this.el).html(html)
    }
  }
  let model = {
    data: {
        uploaderId: '5c91e49f12215f0072937f76',
    	formData: {songListName: '', tagList: '', cover: '', resume: ''},
    	status: 'creating',
    	songListId: ''
    },
    create() {
    	let {songListName, tagList, cover, resume} = this.data.formData
    	let SongLists = AV.Object.extend('SongLists')
    	let songLists = new SongLists()
        let uploader = AV.Object.createWithoutData('Users', this.data.uploaderId);

    	songLists.set('songListName', songListName)
        songLists.set('tagList', tagList)
    	songLists.set('cover', cover)
    	songLists.set('resume', resume)
        songLists.set('uploader', uploader)

    	return songLists.save().then(() => {
    		alert('歌单创建成功!')
    	})
    },
    update() {
    	let {songListName, tagList, cover, resume} = this.data.formData
    	let songLists = AV.Object.createWithoutData('SongLists', this.data.songListId)
    	songLists.set('songListName', songListName)
        songLists.set('tagList', tagList)
    	songLists.set('cover', cover)
    	songLists.set('resume', resume)
    	return songLists.save().then(() => {
    		alert('歌单修改成功!')
    	})
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventHub()
    },
    bindEventHub() {
    	window.eventHub.on('createSongList', () => {
    		this.model.data.status = 'creating'
    		this.model.data.songListId = ''
    		this.clearForm()
    	})
    	window.eventHub.on('selectSongList', data => {
    		let {id, songListName, tagList, cover, resume} = data
    		this.model.data.status = 'editing'
    		this.model.data.songListId = id
    		this.model.data.formData = {songListName, tagList, cover, resume}
		    this.view.render(this.model.data)
            window.eventHub.emit('showListedSongs', id)
    	})
        window.eventHub.on('fillCover', url => {
            $(this.view.el).find(`[name="cover"]`).val(url)
        })
    },
    bindEvents() {
    	$(this.view.el).on('submit', 'form', e => {
    		e.preventDefault()

				let needs = 'songListName tagList cover resume'
				let formData = {}
				needs.split(' ').map(string => {
					formData[string] = $(this.view.el).find(`[name=${string}]`).val()
				})
				Object.assign(this.model.data.formData, formData)
				this.model.data.status === 'creating'? this.createSongList(): this.updateSongList()
    	})
    	$(this.view.el).on('click', '[name="songListDel"]', () => {
    		console.log('尝试删除', this.model.data.songListId)

			let songList = AV.Object.createWithoutData('SongLists', this.model.data.songListId)
			songList.destroy().then(() => {
				alert('歌单已移除！')
                console.log('删除成功!')
				this.clearForm()
				window.eventHub.emit('reloadSongList')
			})
    	})
    	$(this.view.el).on('click', '[name="showListedSongs"]', () => {
    		let id = this.model.data.songListId
    		window.eventHub.emit('showListedSongs', id)
    	})
    	$(this.view.el).on('click', '[name="showUnListedSongs"]', () => {
    		let id = this.model.data.songListId
    		window.eventHub.emit('showUnListedSongs', id)
    	})
        $(this.view.el).on('click', '[name="coverUp"]', () => {
            window.eventHub.emit('uploadCover')
        })
    },
    clearForm() {
    	this.model.data.formData = {}
  		this.view.render(this.model.data)
    },
    createSongList() {
			this.model.create().then(() => {
				window.eventHub.emit('reloadSongList')
				this.clearForm()
			})
    },
    updateSongList() {
    	this.model.update().then(() => {
				window.eventHub.emit('reloadSongList')
			})
    }
  }
  controller.init(view, model)
}