angular.module("lub-storage", [])
    .factory("lubStorage", function ($window) {
        var caches = {};
        return function (name, opts) {
            var options = angular.extend({
                storage:"localStorage"
            }, opts);
            var initialData = {},
                initialLength = 0,
                storage = $window[options.storage];
            if (caches[name]) {
                throw {
                    name:"CacheExists"
                };
            } else {
                var fromStorage = storage[name];
                if (fromStorage) {
                    initialData = JSON.parse(fromStorage);
                    for (var k in initialData) {
                        if (Object.prototype.hasOwnProperty.call(initialData, k)) {
                            initialLength = initialLength + 1;
                        }
                    }
                }
            }
            return  caches[name] = {
                setItem:function (key, val) {
                    this.data[key] = val;
                    this.length = this.length + 1;
                    storage[name] = JSON.stringify(this.data);
                },
                getItem:function (key) {
                    return this.data[key];
                },
                removeItem:function (key) {
                    if (this.length === 0) {
                        return;
                    }
                    delete this.data[key];
                    this.length = this.length - 1;
                    storage[name] = JSON.stringify(this.data);
                },
                clear:function () {
                    this.data = {};
                    delete storage[name];
                    this.length = 0;
                },
                data:initialData,
                length:initialLength
            };
        };
    });