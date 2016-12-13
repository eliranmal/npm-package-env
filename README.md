# npm-package-env

> conveniently get `npm_package_` variables using property accessors

[![NPM][1]][2]


## installation

```shell
npm i npm-package-env -S
```


## usage

###### package.json

```json
{
    "name": "my-package",
    "config": {
        "dev-server": {
            "port": 7777
        }
    },
    "scripts": {
        "start": "my-script"
    }
}
```

###### my-script.js

```javascript
const env = require('npm-package-env')._.at('npm_package_config');
console.log(env['dev-server'].port); // -> 7777
```





[1]: https://img.shields.io/npm/v/npm-package-env.svg?style=flat-square
[2]: https://www.npmjs.com/package/npm-package-env