import Vue from 'vue';
import Router from './router';
import Store from './store/store';
import App from './app.vue';

new Vue({
    router: Router,
    store: Store,
    render: (h)=>h(App),

}).$mount('#app');


