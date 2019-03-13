window.eventHub = {
	events: {},
	emit(eventName, data) {
		this.events[eventName].map(fn => {
			fn.call(undefined, data)
		})
	},
	on(eventName, fn) {
		if(this.events[eventName] === undefined) {
			this.events[eventName] = []
		}
		this.events[eventName].push(fn)
	}
}