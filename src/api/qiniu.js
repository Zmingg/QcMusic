import 'babel-polyfill';
const baseUrl = 'http://127.0.0.1:3001/';


const apiLists = async ()=>{
    try {
        let res = await fetch(baseUrl+'lists');
        let data =  await res.json();
        return { ok:true,data:data };
    } catch(err) {
        return { ok:false,err:err };
    }
};

const apiList = async (lid)=>{
    try {
        let res = await fetch(baseUrl + 'list/' + lid);
        let data =  await res.json();
        return { ok:true,data:data };
    } catch(err) {
        return { ok:false,err:err };
    }
};

const apiAudio = async (aid)=>{
    try {
        let res = await fetch(baseUrl + 'audio/' + aid);
        let data =  await res.json();
        return { ok:true, data:data };
    } catch(err) {
        return { ok:false, err:err };
    }
};

const apiHotKey = async () => {
    try {
        let res = await fetch(baseUrl+'hot_keys');
        let data =  await res.json();
        return { ok:true,data:data };
    } catch(err) {
        return { ok:false,err:err };
    }
};

const apiSearch = async (key) => {
    try {
        let res = await fetch(baseUrl + 'search/' + key);
        let data =  await res.json();
        return { ok:true,data:data };
    } catch(err) {
        return { ok:false,err:err };
    }
};


export { apiLists,apiList,apiAudio,apiHotKey,apiSearch } ;