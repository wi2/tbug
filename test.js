var should = require('should')
  , debug1 = require("./index.js")('hello')
  , debug2 = require("./index.js")(['hello','world']);

describe('test with your access', function(){
  it('basic example', function(){
    debug2('Eh luke');
    debug1('Eh luke');
  });
  it('basic example', function(){
    debug1('Eh Mike');
    debug2('Eh Mike');
  });
  it('basic example', function(done){
    debug2('Eh Jake');
    debug1('Eh Jake');
    setTimeout(done,1500);
  });
});
