function oLog(value) {
  console.log(require('util').inspect(value, {depth: 20, colors: true}));
}

module.exports = {
  oLog: oLog
}
