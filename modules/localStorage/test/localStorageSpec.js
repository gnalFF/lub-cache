(function () {
    'use strict';

    describe('localStorage', function () {

        beforeEach(module("lub-storage"));
        it('should increase in total items when setItem is used', inject(function (lubStorage) {
            var cache = lubStorage("test");
            expect(cache.length).toBe(0);
            cache.setItem("hello", "world");
            expect(cache.length).toBe(1);
        }));
        it("should return the value added with the getItem method",inject(function(lubStorage){
            var cache = lubStorage("test");
            cache.setItem("hello","world");
            expect(cache.getItem("hello")).toBe("world");
        }));
        describe("when removeItem is called",function(){
            it("should decrease length by one for each item removed",inject(function(lubStorage){
                var cache = lubStorage("test");
                cache.setItem("hello","world");
                expect(cache.length).toBe(1);
                cache.removeItem("hello");
                expect(cache.length).toBe(0);
            }));
            it("should not return the removed item when getter is called again",inject(function(lubStorage){
                var cache = lubStorage("test");

                cache.setItem("hello","world");
                cache.removeItem("hello");
                var item = cache.getItem("hello");
                expect(item).not.toBe("world");
                expect(item).toBe(undefined);
            }));
            it("should not have a length less than 0 after removing",inject(function(lubStorage){
                var cache = lubStorage("test");
                cache.removeItem("test");
                expect(cache.length).toBe(0);
            }));
        });
        describe("when a cache is created more then once",function(){
            it("then there should be an error",inject(function(lubStorage){
                var cache = lubStorage("hello");
                expect(function(){
                    lubStorage("hello");
                }).toThrow();
            }));
        });
        it("should be able to also store objects",inject(function(lubStorage){
            var cache = lubStorage("test");
            var toStore = {
                text: "hallo welt"
            };
            cache.setItem("data",toStore);
            expect(cache.getItem("data")).toEqual(toStore);
        }));
        afterEach(function(){
            localStorage.clear();
            sessionStorage.clear();
        });
        it("should save the data to localstorage on setItem",inject(function(lubStorage){
            var cache = lubStorage("test");
            expect(cache.length).toBe(0);
            cache.setItem("hello","world");
            var inLocal = JSON.parse(localStorage.test);
            expect(inLocal.hello).toBe("world");
        }));
        it("should initialize a cache from localStorage if exists",inject(function(lubStorage){
            localStorage.test = JSON.stringify({
               hello: "world"
            });
            var cache = lubStorage("test");
            expect(cache.length).toBe(1);
            expect(cache.getItem("hello")).toBe("world");
        }));
        it("should remove values also from localStorage when removeItem",inject(function(lubStorage){
            var cache = lubStorage("test");
            cache.setItem("hello","world");
            cache.removeItem("hello");
            var data = JSON.parse(localStorage.test);

            expect(Object.keys(data).length).toBe(0);
        }));
        it("should use sessionStorage if wanted",inject(function(lubStorage){
            var cache = lubStorage("test",{
                storage: "sessionStorage"
            });
            cache.setItem("hello","world");
            expect(localStorage.test).toBe(undefined);
            expect(sessionStorage.test).not.toBe(undefined);
            expect(JSON.parse(sessionStorage.test).hello).toBe("world");
        }));
        it("should clear storages and data when calling clear",inject(function(lubStorage){
            var cache = lubStorage("test");
            cache.setItem("hello","world");
            expect(localStorage.test).not.toBe(undefined);
            cache.clear();
            expect(cache.getItem("hello")).toBe(undefined);
            expect(cache.length).toBe(0);
            expect(localStorage.test).toBe(undefined);
        }));
    });

})();