import drawflow from "@/api/drawflow";
// import { router } from "@/main";

const state = {
    loadingPrograms: false,
    programs: [],
    loadingProgramById: false,
    programById: null,
    loadingResult: false,
    result: null,
}
const getters = {
    getPrograms: (state) => ({loading: state.loadingPrograms, programs: state.programs}),
    getProgram: (state) => ({loading: state.loadingProgramById, program: state.programById}),
    getResult: (state) => state.result,
}
const actions = { 
    createProgram: async({commit}, data) => {
        console.log("Entramos al action")
        try {
            commit("setBeforeProgramId")
            const response = await drawflow.createProgram(data);
            commit("setNewProgram", response)
        } catch (error) {
            console.log(error)
        }
    },
    updateProgram: async({commit}, data) => {
        console.log("Entramos al action update")
        try {
            commit("setBeforeProgramId")
            const response = await drawflow.updateProgram(data);
            commit("setNewProgram", response)
        } catch (error) {
            console.log(error)
        }
    },
    getProgramById: async({commit}, id) => {
        try {
            commit("setBeforeProgramById");
            const response = await drawflow.getProgramById(id)
            commit("setProgramById", response);
        } catch (error) {
            console.log(error)
        }
    },
    getAllPrograms: async({commit}) => {
        try {
            commit("setBeforePrograms");
            const response = await drawflow.getPrograms()
            commit("setPrograms", response?.programs);
        } catch (error) {
            console.log(error)
        }
    },

}

const mutations = {
    setBeforeProgramId: (state) => {
        state.loadingResult = true
        state.result = null;
    },
    setNewProgram: (state, result) => {
        state.loadingResult = false
        state.result = result;
    },
    setBeforeProgramById: (state) => {
        state.loadingProgramById = true;
        state.programById = null;
    },
    setProgramById: (state, program) => {
        state.loadingProgramById = false;
        state.programById = program;
    },

    setBeforePrograms: (state) => {
        state.loadingPrograms = true;
        state.programs = null;
    },
    setPrograms: (state, programs) => {
        state.loadingPrograms = false;
        state.programs = programs;
    },

}

export default{
    state,
    getters,
    actions,
    mutations
}