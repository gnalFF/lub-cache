angular.module("lub-local-storage", [])
    .factory("lubLocalStorage", function ($window) {
        return function (name) {
            var data = {};
            return {
                setItem:function (key, val) {
                    data[key] = val;
                    this.length = this.length + 1;
                },
                getItem:function (key) {
                    return data[key];
                },
                removeItem:function (key) {
                    if(this.length === 0){
                        return;
                    }
                    delete data[key];
                    this.length = this.length - 1;
                },
                data:data,
                length:length
            };
        };
    });