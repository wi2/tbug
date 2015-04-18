var ms = require('ms')
  , start = +(new Date())
  , list = []
  , count = 0;

var debug = function(what, opt) {

  var options = opt||{ showHidden: false, depth: null, colors: true }
    , context = typeof what === 'string' ? [what] : what;

  var render = function() {
    process.stdout.write(list.splice(0, 100000).map(function(a){
      var tpof = typeof a;
      return "\n" + " [" + tpof + "] " + (tpof === 'string' ? a : require('util').inspect(a, options));
    }).join(""));
    if (list.length === 0) process.stdout.write("\n");
    else render();
  }
  process.on('exit', render);
  process.on('SIGINT', function () { process.exit(0); });

  var check = function () {
    if ( process.env.dbug) {
      if (process.env.dbug === '*' || context.indexOf(process.env.dbug) > -1)
        return true;
      else if ( process.env.dbug.indexOf('|') > -1) {
        var dbg = process.env.dbug.split("|");
        for (var i=0,len=dbg.length; i<len; i++)
          if (context.indexOf(dbg[i]) > -1) return true
      }
    }
    return false;
  }

  var worker = function() {
    var vals = Array.prototype.slice.call(arguments, 0);
    var dif = +(new Date()) - start;
    start = +(new Date());
    list.push("\n\n----\n" + context.toString() + " " + ms(dif));
    // list.concat(vals);
    for(var i=0,len=vals.length; i<len; i++)
      list.push(vals[i]);
  }
  //init
  if (check()) {
    worker( ms(start) );
    return worker;
  } else return function(){};

}

module.exports = debug;
