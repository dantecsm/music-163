{
	let STORAGE_KEY = 'cm_search_history'
	window.historyStorage = {
		fetch() {
			let histories = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
			return histories
		},
		save(histories) {
			let arr = []
			histories.map(h => !arr.includes(h) && arr.push(h))
			localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
		},
		push(history) {
			if(history === '') return
			let arr = this.fetch()
			arr.unshift(history)
			this.save(arr)
		},
		delete(history) {
			let arr = this.fetch()
			let idx = arr.indexOf(history)
			if(idx < 0) return
			arr.splice(idx, 1)
			this.save(arr)
		}
	}
}