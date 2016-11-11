/**
 * Created by Aleksandr Volkov on 10/11/2016.
 */
const transform = require('./proxyStreamTransform');
const MyStream = require('stream-parallel-queue');
const fs = require('fs');
const cheerio = require('cheerio');
const Stream = require('stream');

class ProxySite extends Stream.Readable {
	constructor(limit, urls) {
		super({objectMode: true});
		this.limit = limit;
		this.urls = urls;
		this.proxies = this.getProxies();
		console.log(this.proxies);
		this.ms1 = new MyStream(this.limit, transform.getInitCookies);
		this.ms2 = new MyStream(this.limit, transform.transformer1);
		this.ms3 = new MyStream(this.limit, transform.transformer2);
		this.setData();
		this.processed = 0;
	}


	setData() {
		this.proxies.forEach(elem => {
			this.ms1.write(elem);
		});
		this.ms1
			.pipe(this.ms2)
			.pipe(this.ms3);

		this.ms3.on('readable', () => {
			let chunk = this.ms3.read();
			this.processed++;
			this.push(chunk);
			// last one chunk supposed to be a null, it will mean that stream is closed
			if(this.processed == this.proxies.length){
				this.push(null)
			}
		});
	}
	_read(){

	}
	getProxyAddress() {
		// us - 12, eu - 5
		let country = parseInt(Math.random() * 2) == 1 ? 'eu' : 'us';
		let proxyNumber = country == 'eu' ? (parseInt(Math.random() * 5) + 1) : (parseInt(Math.random() * 12) + 1);
		return country + proxyNumber;
	}

	getProxies() {
		this.proxies = this.urls.map((url) => {
			return {
				url: url,
				proxySite: `https://${this.getProxyAddress()}.proxysite.com`
			}
		});
		return this.proxies;
	}
}

module.exports = ProxySite;