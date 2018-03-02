import 'babel-polyfill';
const baseUrl = 'http://127.0.0.1:3001/';
// const baseUrl = 'http://music.zmingg.com/api/';
const domain = 'http://oxjyut4f0.bkt.clouddn.com/';

const apiLists = async ()=>{
    try {
        let res = await fetch(baseUrl+'lists');
        return await res.json();
    } catch(err) {
        return { ok:false,err:err };
    }
};

const apiList = async (lid)=>{
    try {
        let res = await fetch(baseUrl + 'list/' + lid);
        return await res.json();
    } catch(err) {
        return { ok:false,err:err };
    }
};

const apiHotAudios = async ()=>{
    try {
        let res = await fetch(baseUrl + 'audios/hot');
        return await res.json();
    } catch(err) {
        return { ok:false, err:err };
    }
};

const apiAudio = async (aid)=>{
    try {
        let res = await fetch(baseUrl + 'audio/' + aid);
        res =  await res.json();
        let fd = new FormData();
        fd.append('key', res.data.src);
        let urlRes = await fetch(baseUrl + 'audio/url', {
            method: 'put',
            body: fd
        });
        urlRes = await urlRes.json();
        Object.assign(res.data, urlRes.data);
        return res;
    } catch(err) {
        return { ok:false, err:err };
    }
};

const apiHotKey = async () => {
    try {
        let res = await fetch(baseUrl+'hot_keys');
        return await res.json();
    } catch(err) {
        return { ok:false,err:err };
    }
};

const apiSearch = async (key) => {
    try {
        let res = await fetch(baseUrl + 'search/' + key);
        return await res.json();
    } catch(err) {
        return { ok:false,err:err };
    }
};


export { domain, apiLists, apiList, apiHotAudios, apiAudio, apiHotKey, apiSearch } ;