import 'babel-polyfill';
const baseUrl = 'http://zmhjy.xyz/';  // http://qc.cc/
const apiSheet = async ()=>{
    try {
        let res = await fetch(baseUrl+'mapi/sheet');
        let data =  await res.json();
        return { ok:true,data:data };
    } catch(err) {
        return { ok:false,err:err };
    }
};

const apiAudio = async (aid)=>{
    try {
        let formData = new FormData();
        formData.append("id",aid);
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




export { apiSheet,apiAudio } ;