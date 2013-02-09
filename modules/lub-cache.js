angular.module('lub-cache', ["lub-storage"])
    .factory("lubCache", function (lubStorage, $log) {
        return function (name, options) {
            return {
                info:function () {
                    return this.$cache.info();
                },
                put:function (key, val, options) {
                    this.$cache.setItem(key, val, options);
                },
                get:function (key) {
                   return this.$cache.getItem(key);
                },
                remove:function (key) {
                    this.$cache.removeItem(key);
                },
                removeAll:function () {
                    this.$cache.clear();
                },
                destroy:function () {
                    $log.debug("will just invoke removeAll");
                    this.removeAll();
                },
                $cache:lubStorage(name, angular.extend({
                    ttl:0,
                    storage:"localStorage"
                }, options))
            };
        };
    });