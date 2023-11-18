const memoryCache = module.exports = {
  get: function (key: string): any[] { return this[key] },
  set: function (key: string, val: any[]) { this[key] = val }
}



