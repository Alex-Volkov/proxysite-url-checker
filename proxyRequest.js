/**
 * Created by Aleksandr Volkov on 07/11/2016.
 */
const request = require('request');
const EventEmitter = require('events');
const debug = require('debug')('proxy');

/**TODO
 * 1. load proxysite, get cookies
 * 2. send POST request to https://eu4.proxysite.com/includes/process.php?action=update
 // {
		server-option:eu4
		d:rbc.ru
		allowCookies:on
	}
 // 2. on redirect get cookies, follow new url
 **/
const fs = require('fs');
class Proxy extends EventEmitter {
	constructor(url, params ={}) {
		super();
		this.url = url;
		this.method = params.method || 'GET';
		this.headers = params.headers;
		this.payload = params.data;
		this.site = params.site;
	}

	getInitUrl() {
		let params = {
			url: this.url,
			method: this.method,
			headers: {cookie:''}
		};
		if (!!this.payload) {
			params.formData = this.payload
		}
		if (!!this.headers) {
			for(let header in this.headers){
				if(!!header){
					params.headers.cookie = this.headers[header];
				}
			}
		}
		debug(params);
		request(params, function (err, resp, body) {
			debug('resp.headers', resp.headers, resp.statusCode);
			if (resp.statusCode == 200) {
				// fs.writeFileSync('params.json', JSON.stringify(params))
				// fs.writeFileSync('tmp.html', body)
				// console.log(body);
			}
			this.emit('succeed', {headers: resp.headers, statusCode: resp.statusCode, body: body, site: this.site, requestUrl: this.url})
		}.bind(this))
	}

}

module.exports = Proxy;