DEBUG_FLAG = {
  debug: false,
  error: true,
  info: true,
  log: true,
  logAsTrace: false, // myConsole.log() as myConsole.trace()
  logAsDebug: false, // myConsole.log() as myConsole.debug()
  trace: false,
  traceAsDebug: true, // myConsole.trace() as myConsole.debug()
  warn: true
}

var noOp = function () { };

console.debug = DEBUG_FLAG.debug ? console.debug : noOp;
console.error = DEBUG_FLAG.error ? console.error : noOp;
console.info  = DEBUG_FLAG.info ? console.info : noOp;
console.log   = DEBUG_FLAG.log ? 
  (DEBUG_FLAG.logAsDebug ? console.debug : 
    (DEBUG_FLAG.logAsTrace ? console.trace : console.log)) : noOp; 
console.trace = DEBUG_FLAG.trace ? 
  (DEBUG_FLAG.traceAsDebug ? console.debug : console.trace) : noOp;
console.warn  = DEBUG_FLAG.warn ? console.warn : noOp;
