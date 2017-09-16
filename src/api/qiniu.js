import 'babel-polyfill';
// const baseUrl = 'http://zmhjy.xyz/';
const baseUrl = 'http://qc.cc/';
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
        formData.append("aid",aid);
        let res = await fetch(baseUrl+'mapi/audio',{
            method: 'POST',
            body: formData
        });
        let data =  await res.json();
        return { ok:true,data:data };
    } catch(err) {
        return { ok:false,err:err };
    }
};

const apiDisc = async (sid)=>{
    try {
        let res = await fetch(baseUrl+'mapi/disc/'+sid);
        let data =  await res.json();
        return { ok:true,data:data };
    } catch(err) {
        return { ok:false,err:err };
    }
};




export { apiList,apiAudio,apiDisc } ;