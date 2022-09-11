import Vue from 'vue'
import Vuex from 'vuex'
import code from './modules/code';
import programs from './modules/programs';

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        programs,
        code
    }
})
Vue.prototype.$store = store;

export default store
