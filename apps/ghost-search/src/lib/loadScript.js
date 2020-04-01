const md5 = require('md5')
const loadScript = url =>
	new Promise(resolve => {
		const md5ed = md5(url)
		const existingScript = document.getElementById(md5ed)

		if (!existingScript) {
			const script = document.createElement('script')
			script.id = md5ed
			script.src = url
			document.body.appendChild(script)
			script.onload = resolve
		} else {
			console.warn('script exist:' + url)
			resolve()
		}
	})

module.exports = loadScript
