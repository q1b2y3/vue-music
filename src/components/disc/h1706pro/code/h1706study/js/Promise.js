// promise 强大的异步编程
//对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。
//一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。

{
    var promise = new Promise(function(resolve, reject) {
        // ... some code
        if (false){
            resolve(1);
        } else {
            reject(2);
        }
    });
    promise.then(data=>{
        console.log(data)
    },err=>{
        console.log(err)
    })
}

{
    //Promise 新建后立即执行，所以首先输出的是Promise。然后，then方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以resolved最后输出。
    let promise = new Promise(function(resolve, reject) {
        console.log('Promise');
        resolve();
    });
    promise.then(function() {
        console.log('resolved.');
    });
    console.log('Hi!');
}

{
    //图片加载成功 调用resolve 否则调用reject
    function loadImageAsync(url) {
        return new Promise(function(resolve, reject) {
            var image = new Image();
            image.onload = function() {
                resolve(image);
            };
            image.onerror = function() {
                reject(new Error('Could not load image at ' + url));
            };
            image.src = url;
        });
    }
}

{
    function printHello (ready) {
        return new Promise(function (resolve, reject) {
            if (ready) {
                resolve("Hello");
            } else {
                reject("Good bye!");
            }
        });
    }

    function printWorld () {
        console.log("World");
    }

    function printExclamation () {
        console.log("!");
    }

    printHello(true)
        .then(function(message){
            console.log(message);
        })
        .then(printWorld)
        .then(printExclamation);
}

{
    //Promise.all 可以接收一个元素为 Promise 对象的数组作为参数，当这个数组里面所有的 Promise 对象都变为 resolve 时，该方法才会返回。
    var p1 = new Promise(function (resolve) {
        setTimeout(function () {
            resolve("Hello");
        }, 3000);
    });

    var p2 = new Promise(function (resolve) {
        setTimeout(function () {
            resolve("World");
        }, 1000);
    });

    Promise.all([p1, p2]).then(function (result) {
        console.log(result); // ["Hello", "World"]
    });
}