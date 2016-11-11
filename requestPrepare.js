/**
 * Created by Aleksandr Volkov on 10/11/2016.
 */
const debug = require('debug')('prepare');
class PrepareRequest {
	constructor() {

	}

	firstStage(obj, urlObj) {
		obj = JSON.parse(obj);
		// console.log(urlObj.proxySite, urlObj.url);
		let proxySite = urlObj.proxySite.match(/\/\/\w{3}/ig)[0].replace('//','');
		let headers = obj.headers;
		headers.cookie = headers['set-cookie'].toString();
		// debug(headers);
		return {
			url: `https://${proxySite}.proxysite.com/includes/process.php?action=update`,
			params: {
				method: 'POST',
				// headers: {cookie: headers['set-cookie'].toString()},
				headers: headers,
				site: urlObj.url,
				data: {
					'server-option': proxySite,
					'd': urlObj.url,
					'allowCookies': 'on'
				}

			}
		}
	}

	secondStage(obj, url) {
		obj = JSON.parse(obj);
		let headers = obj.headers;
		headers.cookie = headers['set-cookie'].toString();
		let res = {
			url: headers.location,
			params: {
				site: url,
				headers: headers
				// headers: {cookie: headers['set-cookie'].toString()},
			}
		};
		debug('second stage prepare', obj.statusCode, obj.headers.location, res);
		// debug(headers)
		// console.log(res);
		return res;
	}

	thirdStage(obj, url) {
		obj = JSON.parse(obj);
		let headers = obj.headers;
		debug('third stage', obj.statusCode, obj.headers.location);
		let res = {
			url: headers.location,
			params: {
				site: url,
				headers: headers
				// headers: {cookie: headers['set-cookie'].toString()},
			}
		};
		// console.log(res);
		return res;
	}
}

module.exports = PrepareRequest;