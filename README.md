# Sylo

Sylo - Fork of Casper The default theme for [Ghost](http://github.com/tryghost/ghost/). This is the latest development version of Casper! If you're just looking to download the latest release, head over to the [releases](https://github.com/HariantoAtWork/ghost-theme-sylo/releases) page.

&nbsp;

![screenshot-desktop](https://user-images.githubusercontent.com/353959/66987533-40eae100-f0c1-11e9-822e-cbaf38fb8e3f.png)

&nbsp;

WORK IN PROGRESS - This Fork isn't build Mobile First and not converted to BEM (CSS style guidelines)

# First time using a Ghost theme?

Ghost uses a simple templating language called [Handlebars](http://handlebarsjs.com/) for its themes.

This theme has lots of code comments to help explain what's going on just by reading the code. Once you feel comfortable with how everything works, we also have full [theme API documentation](https://ghost.org/docs/api/handlebars-themes/) which explains every possible Handlebars helper and template.

**The main files are:**

- `default.hbs` - The parent template file, which includes your global header/footer
- `index.hbs` - The main template to generate a list of posts, usually the home page
- `post.hbs` - The template used to render individual posts
- `page.hbs` - Used for individual pages
- `tag.hbs` - Used for tag archives, eg. "all posts tagged with `news`"
- `author.hbs` - Used for author archives, eg. "all posts written by Jamie"

One neat trick is that you can also create custom one-off templates by adding the slug of a page to a template file. For example:

- `page-about.hbs` - Custom template for an `/about/` page
- `tag-news.hbs` - Custom template for `/tag/news/` archive
- `author-ali.hbs` - Custom template for `/author/ali/` archive


# Development

Sylo styles are compiled using Gulp/SASS to polyfill future CSS spec. You'll need [Node](https://nodejs.org/). After that, from the theme's root directory:

```bash
# install dependencies
npm install

# run development server
npm dev
```

Now you can edit `/assets/css/` files, which will be compiled to `/assets/built/` automatically.

The `zip` Gulp task packages the theme files into `dist/<theme-name>.zip`, which you can then upload to your site.

```bash
# create .zip file
npm zip
```

# Fuck PostCSS Features! Just Gulp streams with SASS

- Autoprefixer - Don't worry about writing browser prefixes of any kind, it's all done automatically with support for the latest 2 major versions of every browser.


# SVG Icons

Casper uses inline SVG icons, included via Handlebars partials. You can find all icons inside `/partials/icons`. To use an icon just include the name of the relevant file, eg. To include the SVG icon in `/partials/icons/rss.hbs` - use `{{> "icons/rss"}}`.

You can add your own SVG icons in the same manner.


# Copyright & License

Copyright (c) 2013-2020 Ghost Foundation - Released under the [MIT license](LICENSE).


# Code Injections


## Site Header

```html
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css" />
<link rel="stylesheet" href="/assets/built/prism.min.css" />
<style>
    pre {
        font-size: 1rem;
        line-height: 2rem;
    }

    /* CUSTOM */
    pre[class*='language-'] {
        max-height: 75vh;
    }
    code[class*='language-'],
    pre[class*='language-'] {
        font-size: 1.4rem;
        line-height: 2rem;
        text-shadow: 0 1px #111;
    }
    
    .post-card-content-link--comment {
        position: relative;
        left: 4px;
        top: 5px;
        background-color: rgba(255,255,255,.8);
        background-image: linear-gradient(141deg,#0fb8ad 0,#1fc8db 51%,#2cb5e8 75%);
        color: white;
        border-radius: 8px;
        padding: 2px 4px !important;
        font-height: 1em;
        font-size: 12px;
    }
</style>
```


## Site Footer

```html
<!-- # Ghost Search Component -->
<script>
;(() => {
    // Creates element: ghost-search
	let d = document
	if (!d.body) d.body = d.createElement('body')
	const ghostSearchDom = d.body.appendChild(d.createElement('ghost-search'))
	const attributes = {
		'url': location.origin,
		'ghost-key': 'c3426374501bcd41a801c5a74a'
	}
	for (let [key, value] of Object.entries(attributes)) {
		ghostSearchDom.setAttribute(key, value)
	}
	
})()
</script>
<script src="https://unpkg.com/vue"></script>
<script src="/assets/built/vue/ghost-search.min.js" async></script>

<!-- # Prism Code Highlighting-->
<script>
;(() => {
    // Add class .line-numbers to pre/code for Line Numbers
    const codeElememts = document.querySelectorAll("[class*='language-']:not(.line-numbers)")
    codeElememts.forEach((el, i) => el.classList.add('line-numbers'))
    if (Prism.plugins && Prism.plugins.autoloader) Prism.plugins.autoloader.languages_path = '//cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/components/'
})()
</script>

<!-- # Disqus Javascript Tricks -->
<!-- ## Disqus Thread - Post Page -->
<script>
;(() => {
    // Creates element #disqus_thread and load Disqus script
	let d = document,
        el = d.querySelector('#site-main .post-full')
	
    if (el) {
    	const disqusThread = d.createElement('footer'),
              s = d.createElement('script')
        disqusThread.setAttribute('id', 'disqus_thread')
        el.appendChild(disqusThread)
        s.src = '//hariantoatworkblog-dev.disqus.com/embed.js'
        s.setAttribute('data-timestamp', +new Date())
        ;disqusThread && (d.head || d.body).appendChild(s)
    }
})()
</script>

<!-- ## Disqus Counts - Default Page -->
<script id="dsq-count-scr" src="//hariantoatworkblog.disqus.com/count.js" async></script>
<script>
;(() => {
	// Add disqus counter on each Card and
	let d = document,
		postFeed = d.querySelector('.post-card').parentElement,
		postFeedObserver = new MutationObserver(mutations => {
			mutations.forEach(
				mutation =>
					mutation.addedNodes.length &&
					addDisqusCounterLink(mutation.addedNodes[0])
			)
			return (
				mutations && DISQUSWIDGETS && DISQUSWIDGETS.getCount({ reset: true })
			)
		})

	const addDisqusCounterLink = postCard => {
        if (!postCard.classList.contains('post-card')) return
		const postCardContentLink = postCard.querySelector(
				'.post-card-content-link'
			),
			{ href, title } = postCardContentLink

		const postCardMeta = postCard.querySelector('.post-card-meta')
		if (!postCardMeta.querySelector('.post-card-content-link--comment')) {
			const div = postCardMeta.appendChild(d.createElement('div'))
			div.classList.add('.post-card-comment')
			const a = div.appendChild(d.createElement('a'))
			a.setAttribute('href', href + '#disqus_thread')
			a.setAttribute('title', title)
			a.classList.add('post-card-content-link--comment')
			a.innerText = 'Comment'
		}
	}

	postFeed &&
		Array.from(postFeed.children).forEach(addDisqusCounterLink)
		)

	// Attach
	postFeed &&
		postFeedObserver.observe(postFeed, {
			childList: true
		})
})()
</script>

```