import axios from "axios";

const BASE_URL = "http://localhost:4000";

export default {
    createProgram: async(data) => {
        console.log("empezamos peticion") 
        const response = await axios.post(`${BASE_URL}/programs`, {...data, uid: "_:newprogram", "dgraph.type": ["Program"],  drawflow: JSON.stringify({"drawflow": {"Home": {"data": {} } }}) }, {
            headers:{
                "Content-Type": "application/json" 
            }
        })
        console.log(response)
        return response
    },
    getProgramById: async(id) => {
        const response = await axios.get(`${BASE_URL}/programs/${id}`, {
            headers:{
                "Content-Type": "application/json" 
            }
        })
        console.log(response)
        return response?.data
    },
    getPrograms: async() => {
        const response = await axios.get(`${BASE_URL}/programs`, {
            headers:{
                "Content-Type": "application/json" 
            }
        })
        console.log(response)
        return response?.data
    },
    updateProgram: async(data) => {
        const response = await axios.post(`${BASE_URL}/programs`, data, {
            headers:{
                "Content-Type": "application/json" 
            }
        })
        console.log("update: ", response)
        return response
    },
    executeCode: async(data) => {
        const response = await axios.post(`${BASE_URL}/execute`, {textfile: data}, {
            headers:{
                "Content-Type": "application/json" 
            }
        })
        console.log("code: ", response)
        return response
    }

    
    
}