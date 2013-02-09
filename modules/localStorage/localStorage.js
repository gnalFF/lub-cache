angular.module("lub-storage", [])
    .factory("lubStorage", function ($window) {
        var caches = {};
        return function (name, opts) {
            var options = angular.extend({
                storage:"localStorage",
                ttl:0
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
                setItem:function (key, val, opts) {
                    this.data[key] = this.$toCacheObject(val, opts);
                    this.length = this.length + 1;
                    storage[name] = JSON.stringify(this.data);
                },
                getItem:function (key) {
                    return this.$cacheObject(key).data;
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
                length:initialLength,
                $cacheObject:function (key) {
                    var defaultRet = {
                        data: undefined
                    };
                    var item = this.data[key] || defaultRet;
                    if (!item.expires) {
                        return item;
                    } else if (this.$getTime() <= item.expires) {
                        return item;
                    } else {
                        this.removeItem(key);
                        return defaultRet;
                    }
                },
                $getTime:function () {
                    return new Date().getTime();
                },
                $toCacheObject:function (val, opts) {
                    var config = angular.extend({
                        ttl:0
                    }, options, opts);
                    var item = {
                        data:val
                    };
                    if (angular.isNumber(config.ttl) && config.ttl > 0) {
                        item.expires = this.$getTime() + config.ttl;
                    }
                    return item;
                }
            };
        };
    });