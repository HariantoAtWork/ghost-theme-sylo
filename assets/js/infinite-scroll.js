/* eslint-env browser */

/**
 * Infinite Scroll
 * Used on all pages where there is a list of posts (homepage, tag index, etc).
 *
 * When the page is scrolled to 300px from the bottom, the next page of posts
 * is fetched by following the the <link rel="next" href="..."> that is output
 * by {{ghost_head}}.
 *
 * The individual post items are extracted from the fetched pages by looking for
 * a wrapper element with the class "post-card". Any found elements are appended
 * to the element with the class "post-feed" in the currently viewed page.
 */

;(() => {
	const nextElement = document.querySelector('link[rel=next]'), // next link element
		feedElement = document.querySelector('.post-feed') // post feed element
	if (!nextElement || !feedElement) return

	const state = {
		activeZoneHeight: 300,
		ticking: false,
		lastScrollY: window.scrollY,
		lastWindowHeight: window.innerHeight,
		lastDocumentHeight: document.documentElement.scrollHeight,
		href: nextElement.href
	}

	const app = {
		loading: false,
		onPageLoad(doc) {
			const nextElement = doc.querySelector('link[rel=next]')
			state.href = nextElement && nextElement.href

			const postElements = doc.querySelectorAll('.post-card')
			Array.from(postElements).forEach(item => {
				console.log(`# ${item.querySelector('.post-card-title').innerHTML}`)
				// document.importNode is important, without it the item's owner
				// document will be different which can break resizing of
				// `object-fit: cover` images in Safari
				// feedElement.appendChild(body.importNode(item, true))
				feedElement.appendChild(item)
			})
		},
		onUpdate() {
			const {
					lastScrollY,
					lastWindowHeight,
					lastDocumentHeight,
					activeZoneHeight,
					href
				} = state,
				{ loading } = this

			if (loading || !href) return

			// return if not scroll to the bottom
			if (
				lastScrollY + lastWindowHeight <=
				lastDocumentHeight - activeZoneHeight
			) {
				state.ticking = false
				return
			}

			this.loading = true
			console.log('---- onUpdate: START', { href })
			fetch(href)
				.then(r => r.text())
				.then(text => new DOMParser().parseFromString(text, 'text/html'))
				.then(this.onPageLoad)
				.then(() => {
					console.log('---- onUpdate: END')
					// sync status
					this.loading = false
					state.lastDocumentHeight = document.documentElement.scrollHeight
					state.ticking = false
				})
		}
	}

	const requestTick = () => {
		state.ticking || requestAnimationFrame(app.onUpdate.bind(app))
		state.ticking = true
	}
	const onScroll = event => {
		state.lastScrollY = window.scrollY
		requestTick()
	}

	const onResize = event => {
		state.lastWindowHeight = window.innerHeight
		state.lastDocumentHeight = document.documentElement.scrollHeight
		requestTick()
	}

	const eventListeners = [
		['scroll', onScroll, { passive: true }],
		['resize', onResize]
	]

	const factoryListener = list => {
		let isCreated = false
		return {
			onCreate() {
				if (!isCreated) {
					list.forEach(element => addEventListener(...element))
					isCreated = true
				}
			},
			onDestroy() {
				if (isCreated) {
					list.forEach(element => removeEventListener(...element))
					isCreated = false
				}
			}
		}
	}

	const EventListeners = factoryListener(eventListeners)
	EventListeners.onCreate()
})()
