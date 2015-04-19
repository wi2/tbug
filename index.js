var ms = require('ms')
  , start = +(new Date())
  , list = []
  , count = 0
  , orig = Error.prepareStackTrace
  , err = new Error;

var errorTrace = function(){
  Error.prepareStackTrace = function(_, stack){ return stack; };
  Error.captureStackTrace(err, arguments.callee);
  var stack = err.stack;
  Error.prepareStackTrace = orig;
  if (stack[0].getFileName() !== stack[1].getFileName())
    return stack[1].getFileName() + " " + stack[1].getLineNumber() + " " + (stack[1].getFunctionName() ? " - "+stack[1].getFunctionName()+"()" : "");
  else
    return null;
}

var tbug = function(what, opt) {

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
    if ( process.env.tbug) {
      if (process.env.tbug === '*' || context.indexOf(process.env.tbug) > -1)
        return true;
      else if ( process.env.tbug.indexOf('|') > -1) {
        var dbg = process.env.tbug.split("|");
        for (var i=0,len=dbg.length; i<len; i++)
          if (context.indexOf(dbg[i]) > -1) return true
      }
    }
    return false;
  }

  var worker = function() {
    var vals = Array.prototype.slice.call(arguments, 0)
      , dif = +(new Date()) - start
      , tmpTrace = errorTrace();

    if (tmpTrace !== undefined)
      list.push("\n\n-- " + tmpTrace + "\n-- " + context.toString() + " " + ms(dif));
      for(var i=0,len=vals.length; i<len; i++)
        list.push(vals[i]);
    start = +(new Date());
  }

  //init
  if (check()) {
    worker( ms(start) );
    return worker;
  } else return function(){};

}

module.exports = tbug;
