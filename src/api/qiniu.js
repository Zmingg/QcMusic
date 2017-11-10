import 'babel-polyfill';
const baseUrl = 'http://zmhjy.xyz/';
// const baseUrl = 'http://qc.cc/';

const apiLists = async ()=>{
    try {
        let res = await fetch(baseUrl+'mapi/lists');
        let data =  await res.json();
        return { ok:true,data:data };
    } catch(err) {
        return { ok:false,err:err };
    }
};

const apiList = async (lid)=>{
    try {
        let res = await fetch(baseUrl+'mapi/list/'+lid);
        let data =  await res.json();
        return { ok:true,data:data };
    } catch(err) {
        return { ok:false,err:err };
    }
};

const apiAudio = async (aid)=>{
    try {
        let formData = new FormData();
        let expire = ~~((new Date()).getTime()/1000+3600);
        formData.append("expire",expire);
        formData.append("aid",aid);
        let res = await fetch( baseUrl + 'mapi/audio', {
            method: 'POST',
            body: formData
        });
        let data =  await res.json();
        return { ok:true, data:data };
    } catch(err) {
        return { ok:false, err:err };
    }
};

const apiHotKey = async () => {
    try {
        let res = await fetch(baseUrl+'mapi/keys');
        let data =  await res.json();
        return { ok:true,data:data };
    } catch(err) {
        return { ok:false,err:err };
    }
};

const apiSearch = async (key) => {
    try {
        let res = await fetch(baseUrl + 'mapi/search/' + key);
        let data =  await res.json();
        return { ok:true,data:data };
    } catch(err) {
        return { ok:false,err:err };
    }
};


export { apiLists,apiList,apiAudio,apiHotKey,apiSearch } ;