// const DOMParser = require('xmldom').DOMParser
const parser = new DOMParser()
const parseFromString = text => parser.parseFromString(text, 'text/xml')
const axiosBluebird = require('axiosbluebird')
const Promise = axiosBluebird.Promise
let retrieveDataRequest = Promise.resolve()

const lastBuildDate = url => {
	retrieveDataRequest.cancel()

	return axiosBluebird
		.get(url)
		.then(({ data }) => data)
		.then(parseFromString)
		.then(
			xmlDoc =>
				xmlDoc.getElementsByTagName('lastBuildDate')[0].childNodes[0].nodeValue
		)
		.catch(console.error.bind(console, 'FAIL - lastBuildDate'))
}

module.exports = lastBuildDate
