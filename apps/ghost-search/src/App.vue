<template>
	<div class="ghost-search">
		Derp
	</div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
const lastBuildDate = require('./lib/lastBuildDate')
const loadScript = require('./lib/loadScript')

export default {
	name: 'App',
	components: {},
	props: {
		'script': {
			type: String,
			default:
				'https://unpkg.com/@tryghost/content-api@1.3.9/umd/content-api.min.js'
		},
		'url': {
			type: String,
			required: true
		},
		'ghostKey': {
			type: String,
			required: true
		},
		'version': {
			type: String,
			default: 'v3'
		}
	},
	data: () => ({
		posts: []
	}),
	created() {
		loadScript(this.script)
			.then(() => {
				const { url, ghostKey, version } = this
				const api = (window['api'] = new window.GhostContentAPI({
					url,
					key: ghostKey,
					version
				}))
				return api
			})
			.then(console.log.bind(console, 'API LOADED'))
		lastBuildDate('http://blog.ghost.localhost/rss/').then(
			console.log.bind(console)
		)
		console.log('url:', this.url)
	}
}
</script>

<style lang="scss">
.ghost-search {
}
</style>
