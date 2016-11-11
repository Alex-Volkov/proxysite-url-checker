const expect = require('chai').expect;
// const assert = chai.assert;
const Proxy = require('../proxyRequest');
// const stream = require('../proxyStream');
const request = require('request');
const fs = require('fs');
const ProxySite = require('../proxysite');
const cheerio = require('cheerio');


describe('proxy module', function () {
	it('should get response from example.com through proxy', function (done) {
		let proxy = new Proxy('https://google.com', 'GET');
		proxy.getInitUrl();
		proxy.on('succeed', function (data) {
			// console.log(data);
			expect(data).to.be.an('object');
			expect(data).to.have.all.keys('headers', 'statusCode', 'body', 'site', 'requestUrl');
			expect(data.statusCode).to.be.equal(200);
			done();
		});
	})

});

describe('proxy site module', function () {
	it('should ', function (done) {
		this.timeout(10000);
		let res = [];
		let urls = [
			'checkip.com', 'checkip.com', 'checkip.com', 'checkip.com'
			// , 'checkip.com', 'checkip.com', 'checkip.com'
		];
		let proxySite = new ProxySite(3, urls);
		proxySite.on('readable', () => {
			let data = JSON.parse(proxySite.read());
			// last one chunk supposed to be a null
			if (data) {
				let ip = cheerio(data.body).find('#ip span').text();
				console.log(data.site, data.statusCode, ip);
				res.push({
					code: data.code,
					ip: ip,
					site: data.site
				})
			}
		})
			.on('end', () => {
				expect(urls.length).to.be.equal(res.length);
				expect(res[0]).to.have.all.keys('code', 'ip', 'site');
				expect(res[1].ip).not.to.be.equal(res[0].ip);
				done();
			})

	})
})

