import Vue from 'vue'
import Vuex from 'vuex'
import programs from './modules/programs';

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        programs,
    }
})
Vue.prototype.$store = store;

export default store
