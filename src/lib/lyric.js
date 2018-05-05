const getLyric = (url,callback) => {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'text';
    request.onload = function() {
        callback(request.status === 200 ? makeLrcArr(request.response) : []);

    };
    request.send();
};

const makeLrcArr = (lrc) => {
    let arr = lrc.split(/\n/);
    let pattern = /\[\d{2}:\d{2}.\d{2}\]/g;
    let result = [];
    arr.forEach(function (v,i,arr) {
        let time = v.match(pattern);
        let value = v.replace(pattern,'');
        time.forEach(function(_v, _i, _arr) {
            //去掉时间里的中括号
            let t = _v.slice(1, -1).split(':');
            //将结果压入最终数组
            result.push([t[0] * 60 + (+t[1]), value]);
        });
    });
    let sortRule = (a,b)=>{
        return a[0]-b[0];
    };
    result.sort(sortRule);
    return result;
};

export default getLyric;