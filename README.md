#proxysite url checker 

App to check and array of urls with different proxies from proxysite.com.
it can be useful to provide anonymous url checking or scraping

the first parameter to the new object is the limit of parallel queries 

```
let urls = ['checkip.com', 'checkip.com', 'checkip.com', 'checkip.com'];
let proxySite = new ProxySite(3, urls);
```
the app will return a stream of processed objects
```
proxySite.on('readable', () => {
    let data = JSON.parse(proxySite.read());
        // last one chunk supposed to be a null
        if (data) {
            let ip = cheerio(data.body).find('#ip span').text();
            res.push({
                code: data.code,
                ip: ip,
                site: data.site
            })
        }
    })
```