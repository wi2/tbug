# tbug
A simple trace debug

Accumulates data without blocking process and on exit output the result.
Filtering by context(s).


## INSTALL
```npm install tbug```


## USE
```
var tbug = require('tbug')('context1');

var a = 'lorem';
var b = 'ipsum';

tbug(a, b);
```

```tbug=* npm start```

or filtering by context ```tbug=context1 node index.js```
or write in file the result ```tbug=context1 npm start > tbug.log```


### On exit you should see on terminal the trace of debug




