/**
 * Created by Aleksandr Volkov on 10/11/2016.
 */
const Proxy = require('./proxyRequest');
const RequestPrepare = require('./requestPrepare');
const prepareRequest = new RequestPrepare();
const debug = require('debug')('transform');
/**
 * transformation functions for transformer string
 */

/**
 *
 * @param elem
 * @param push
 * @param done
 */

function getInitCookies(elem, push, done) {
	let proxy = new Proxy(elem.proxySite);
	proxy.getInitUrl();
	proxy.on('succeed', data => {
		debug('first stage transform', prepareRequest.firstStage(JSON.stringify(data), elem));
		push(prepareRequest.firstStage(JSON.stringify(data), elem));
		// push(JSON.stringify(header));
		done()
	})
}

function transformer1(elem, push, done) {
	let proxy = new Proxy(elem.url, elem.params);
	proxy.getInitUrl();
	proxy.on('succeed', data => {
		debug('second stage transform', prepareRequest.secondStage(JSON.stringify(data), data.site));
		push(prepareRequest.secondStage(JSON.stringify(data), data.site));
		done()
	});
}
function transformer2(elem, push, done) {
	let proxy = new Proxy(elem.url, elem.params);
	proxy.getInitUrl();
	proxy.on('succeed', data => {
		debug('third stage transform', prepareRequest.thirdStage(JSON.stringify(data), data.site));
		// push(JSON.stringify(data.site), elem.site);
		push(JSON.stringify(data));
		// push(prepareRequest.thirdStage(JSON.stringify(data)));
		done()
	});
}


module.exports = {transformer1, transformer2, getInitCookies};

