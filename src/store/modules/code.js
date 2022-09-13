import drawflow from "@/api/drawflow";
// import { router } from "@/main";

const state = {
    code: "",
    loadingResult: false,
    result: null,
}
const getters = {
    getCode: (state) => state.code,
    getCodeResults: (state) => ({loading: state.loadingResult, result: state.result}),
}
const actions = { 
    executeCode: async({commit}, data) => {
        console.log("Entramos al action")
        try {
            commit("setBeforeExecuteCode")
            const response = await drawflow.executeCode(data);
            commit("setExecutedCode", JSON.stringify(response.data, null, 2))
        } catch (error) {
            console.log(error)
            commit("setExecutedCode", {error: error.response.data.description.slice(172)})
        }
    },
    changeCode: ({commit}, code) => {
        commit("setCode", code)
    }
}

const mutations = {
    setBeforeExecuteCode: (state) => {
        state.loadingResult = true
        state.result = null;
    },
    setExecutedCode: (state, result) => {
        state.loadingResult = false
        state.result = result;
    },
    setCode: (state, code) => {
        state.code = code
    }

}

export default{
    state,
    getters,
    actions,
    mutations
}