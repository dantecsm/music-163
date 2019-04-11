{
  let view = {
    el: 'section.searchModule',
    find(selector) {
      return $(this.el).find(selector)
    },
    template: `
      <form action="">
        <div class="row">
          <input class="search" name="search" type="text" placeholder="搜索歌手、歌曲、专辑" autocomplete="off" autofocus>
          <div class="search-icon" aria-hidden="true">
            <svg class="icon">
              <use xlink:href="#icon-search"></use>
            </svg>
          </div>
          <div class="clear-icon" aria-hidden="true">
            <svg class="icon">
              <use xlink:href="#icon-clear"></use>
            </svg>
          </div>
        </div>
      </form>
      <div class="hint">
        <p class="active">搜索:<span id="wd"></span></p>
        <ul class="hintList"></ul>
      </div>
      <div class="result">
        <ul class="resultList songList"></ul>
      </div>
    `,
    hintTemplate: `
      <li>
        <div class="search-icon" aria-hidden="true">
          <svg class="icon">
            <use xlink:href="#icon-search"></use>
          </svg>
        </div>
        <p>__songName__</p>
      </li>
    `,
    resultTemplate: `
      <li>
        <a class="songItem" href="./song.html?id=__songId__">
          <div class="songMsg">
            <h3>__songName__</h3>
            <p>__songSinger__</p>
          </div>
          <div class="logo">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-bofang"></use>
            </svg>
          </div>
        </a>
      </li>
    `,
    noResultTemplate: `
      <div class="emptyHint">暂无搜索结果</div>
    `,
    render(data = {}) {
    	$(this.el).html(this.template)
    },
    renderHint(arr) {
      console.log(arr)
      let $liList = arr.map(obj => $(this.hintTemplate.replace('__songName__', obj.song)))
      this.find('ul.hintList').empty().append($liList)
    },
    renderResult(arr) {
      let $liList = arr.map(obj => {
        let li = this.resultTemplate
        li = li.replace('__songId__', obj.id)
        li = li.replace('__songName__', obj.song)
        li = li.replace('__songSinger__', obj.singer)
        return $(li)
      })
      if($liList.length === 0) {
        this.find('ul.resultList').empty().append(this.noResultTemplate)
      } else {
        this.find('ul.resultList').empty().append($liList)
      }
    }
  }
  let model = {
    data: {},
    fetch(wd) {
      return new Promise((resolve, reject) => {
        let list = []
        let cql = `select song,singer from Song where song regexp ".*${wd}.*" or singer regexp ".*${wd}.*"`
        AV.Query.doCloudQuery(cql).then(data => {
          list = data.results.map(d => {
            return {id: d.id, ...d.attributes}
          })
          resolve(list)
        })
      })
    },
    search(wd) {
      return this.fetch(wd)
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
    bindEvents() {
      this.lazyLoadHint = _.debounce(this.loadHint, 300)
      this.view.find('form').on('submit', e => {
        e.preventDefault()

        this.hideHint()
        this.hideRecent()
        this.showResult()
        window.eventHub.emit('hideHot')

        let val = $(e.currentTarget).find('[name="search"]').val()
        if(val === '') return
        window.historyStorage.push(val)
        this.model.search(val).then(arr => {
          val !== '' && this.view.find('form .clear-icon').addClass('active')
          this.view.renderResult(arr)
        })
      })

      this.view.find('[name="search"]').on('input', e => {
        let val = $('[name="search"]').val()
        this.lazyLoadHint(val)
      })

      this.view.find('.search-icon').on('click', e => {
        this.view.find('form').submit()
      })

      this.view.find('.clear-icon').on('click', e => {
        $('[name="search"]').val('')
        this.lazyLoadHint('')
      })

      $(this.view.el).on('click', '.hintList >li', e => {
        let text = $(e.currentTarget).find('p').text()
        window.eventHub.emit('search', text)
      })
    },
    showHint() {
      this.view.find('.hint').addClass('active')
      this.view.find('form .clear-icon').addClass('active')
    },
    hideHint() {
      this.view.find('.hint').removeClass('active')
      this.view.find('form .clear-icon').removeClass('active')
    },
    showResult() {
      this.view.find('.resultList').addClass('active')
    },
    hideResult() {
      this.view.find('.resultList').removeClass('active')
    },
    hideRecent() {
      window.eventHub.emit('hideRecent')
    },
    showRecent() {
      window.eventHub.emit('showRecent')
    },
    loadHint(val) {
      if (val === '') {
        this.hideHint()
        this.hideResult()
        this.showRecent()
        window.eventHub.emit('showHot')
        return
      }
      this.showHint()
      this.hideResult()
      this.hideRecent()
      window.eventHub.emit('hideHot')
      this.view.find('#wd').text(`"${val}"`)
      this.model.fetch(val).then(arr => {
        this.view.renderHint(arr)
      })
    },
    bindEventHub() {
      window.eventHub.on('focusInput', e => {
        this.view.find('input.search').focus()
      })
      window.eventHub.on('search', string => {
        this.view.find('[name="search"]').val(string)
        this.view.find('form').submit()
      })
    }
  }
  controller.init(view, model)
}