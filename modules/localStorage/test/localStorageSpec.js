(function () {
    'use strict';

    describe('localStorage', function () {

        beforeEach(module("lub-local-storage"));
        it('should increase in total items when setItem is used', inject(function (lubLocalStorage) {
            var cache = lubLocalStorage("test");
            expect(cache.length).toBe(0);
            cache.setItem("hello", "world");
            expect(cache.length).toBe(1);
        }));
        it("should return the value added with the getItem method",inject(function(lubLocalStorage){
            var cache = lubLocalStorage("test");
            cache.setItem("hello","world");
            expect(cache.getItem("hello")).toBe("world");
        }));
        describe("when removeItem is called",function(){
            it("should decrease length by one for each item removed",inject(function(lubLocalStorage){
                var cache = lubLocalStorage("test");
                cache.setItem("hello","world");
                expect(cache.length).toBe(1);
                cache.removeItem("hello");
                expect(cache.length).toBe(0);
            }));
            it("should not return the removed item when getter is called again",inject(function(lubLocalStorage){
                var cache = lubLocalStorage("test");

                cache.setItem("hello","world");
                cache.removeItem("hello");
                var item = cache.getItem("hello");
                expect(item).not.toBe("world");
                expect(item).toBe(undefined);
            }));
            it("should not have a length less than 0 after removing",inject(function(lubLocalStorage){
                var cache = lubLocalStorage("test");
                cache.removeItem("test");
                expect(cache.length).toBe(0);
            }));
        });

    });

})();