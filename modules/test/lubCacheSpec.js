(function () {
    "use strict";

    describe("lubCache", function () {

        beforeEach(module("lub-cache"));
        beforeEach(function(){
            inject(function($log){
                if(!$log.debug){

                    $log.debug = function(a,b,c){
                    };
                }
            });
        });
        afterEach(function () {
            localStorage.clear();
            sessionStorage.clear();

        });
        it("should init a lubStorage", inject(function (lubCache) {
            var cache = lubCache("test");

            var info = cache.info();

            expect(info.ttl).toBe(0);
            expect(info.length).toBe(0);
            expect(info.name).toBe("test");

            cache.put("hello", "world");
            info = cache.info();

            expect(info.length).toBe(1);
        }));

        it("should invoke corresponding methods on $cache", inject(function (lubCache) {
            var cache = lubCache("test");
            spyOn(cache.$cache, "setItem").andCallThrough();
            spyOn(cache.$cache, "getItem").andCallThrough();
            spyOn(cache.$cache, "removeItem").andCallThrough();
            spyOn(cache.$cache, "clear").andCallThrough();

            cache.put("hello","world");
            expect(cache.info().length).toBe(1);

            expect(cache.$cache.setItem).toHaveBeenCalledWith("hello","world",undefined);
            var item = cache.get("hello");
            expect(cache.$cache.getItem).toHaveBeenCalledWith("hello");
            expect(item).toBe("world");

            cache.remove("hello");
            expect(cache.$cache.removeItem).toHaveBeenCalledWith("hello");
            expect(cache.info().length).toBe(0);

            cache.put("hello","world",{
                ttl: 0
            });
            expect(cache.$cache.setItem).toHaveBeenCalledWith("hello","world",{
                ttl: 0
            });
            cache.removeAll();
            expect(cache.$cache.clear).toHaveBeenCalled();
            expect(cache.info().length).toBe(0);

            cache.destroy();
            expect(cache.$cache.clear).toHaveBeenCalled();
            expect(cache.info().length).toBe(0);
        }));

    });
})();