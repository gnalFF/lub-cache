angular.module("lub-storage", [])
    .factory("lubStorageRandomHelper", [function () {
    return function (min, max) {
        //from mdn
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
}])
    .factory("lubStorageKeysHelper", [function () {
    return function (data) {
        if (Object.keys) {
            return Object.keys(data);
        }
        var keys = [];
        for (var k in initialData) {
            if (Object.prototype.hasOwnProperty.call(initialData, k)) {
                keys.push(k);
            }
        }
        return keys;
    };
}])
    .factory("lubStorageFailover", ["lubStorageKeysHelper", "lubStorageRandomHelper", function (lubStorageKeysHelper, lubStorageRandomHelper) {
    return function (currentData) {
        var k = lubStorageKeysHelper(currentData);
        var removeCount = k.length === 0 ? 0 : 1;
        if (k.length >= 10) {
            removeCount = k.length / 10;
        }
        for (var i = 0; i < removeCount; i++) {
            var rand = lubStorageRandomHelper(0, k.length - 1);
            delete currentData[k[rand]];
            k.splice(rand, 1);
        }
        return currentData;
    };
}])
    .factory("lubStorage", ["$window", "lubStorageFailover", "lubStorageKeysHelper", function ($window, lubStorageFailover, lubStorageKeysHelper) {
    var caches = {};
    var readAll = function (storage, key) {
            var item = storage.getItem(key);
            return item ? JSON.parse(item) : undefined;
        },
        saveAll = function (storage, key, value, failOver) {
            try {
                storage.setItem(key, JSON.stringify(value));
            } catch (e) {
                var zipped = failOver(value);
                saveAll(storage, key, zipped, failOver);
            }
        },
        removeAll = function (storage, name) {
            storage.removeItem(name);
        };
    return function (name, opts) {
        var options = angular.extend({
            storage:"localStorage",
            ttl:0,
            failOver:lubStorageFailover
        }, opts);
        var initialData = {},
            initialLength = 0,
            storage = $window[options.storage];
        if (caches[name]) {
            throw {
                name:"CacheExists"
            };
        } else {
            var fromStorage = readAll(storage, name);
            if (fromStorage) {
                initialLength = lubStorageKeysHelper(fromStorage).length;
                initialData = fromStorage;
            }
        }
        return  caches[name] = {
            setItem:function (key, val, opts) {
                this.data[key] = this.$toCacheObject(val, opts);
                this.length = this.length + 1;
                saveAll(storage, name, this.data, options.failOver);
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
                saveAll(storage, name, this.data, options.failOver);
            },
            clear:function () {
                this.data = {};
                this.length = 0;
                removeAll(storage, name);
            },
            info:function () {
                return {
                    name:name,
                    ttl:options.ttl,
                    length:this.length
                };
            },
            data:initialData,
            length:initialLength,
            $cacheObject:function (key) {
                var defaultRet = {
                    data:undefined
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
                    data:val,
                    created:this.$getTime()
                };
                if (angular.isNumber(config.ttl) && config.ttl > 0) {
                    item.expires = item.created + config.ttl;
                }
                return item;
            }
        };
    };
}]);