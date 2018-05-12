/*
* ES5 的对象属性名都是字符串，这容易造成属性名的冲突。
* 比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模式），
* 新方法的名字就有可能与现有方法产生冲突。如果有一种机制，保证每个属性的名字都是独一无二的就好了，
* 这样就从根本上防止属性名的冲突。这就是 ES6 引入Symbol的原因
* **/
{
    let s = Symbol();
    console.log(typeof s)
}

{
//     let mySymbol = Symbol();
//
// // 第一种写法
//     let a = {};
//     a[mySymbol] = 'Hello!';
//
// // 第二种写法
//     let a = {
//         [mySymbol]: 'Hello!'
//     };
//
// // 第三种写法
//     let a = {};
//     Object.defineProperty(a, mySymbol, { value: 'Hello!' });
//
// // 以上写法都得到同样结果
//     a[mySymbol] // "Hello!"
}

{
    const mySymbol = Symbol();
    const a = {};

    a.mySymbol = 'Hello!';
    a[mySymbol] // undefined
    a['mySymbol'] // "Hello!"
    
    let http = {};
    
    const path = Symbol();
    //唯一的标识符
    http[path] = "http://localhost:8080";
 
}

{
    var a = {};
    var name = Symbol();
    a.name = 'lili';
    a[name] = 'lucy';
    console.log(a.name,a[name]);
}


{
    var s1 = Symbol.for('foo');
    var s2 = Symbol.for('foo');

    s1 === s2 // true
}
