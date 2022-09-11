<template>
  <div style="overflow-y: scroll !important;">
    <a-spin tip="Loading..." :spinning="getPrograms?.loading" style="width: 100%; height: 100vh;">
    <div class="my-5 pb-5 container h-100 d-flex flex-column justify-content-center align-items-center">
      <div class="row w-100 justify-content-center align-items-center">
        <div class="col-4 my-2" :key="program?.uid" v-for="program in getPrograms?.programs">
          <a-card :title="program?.name" @click="() => handlePush(program?.uid)" style="cursor: pointer;">
            <router-link slot="extra" :to="`/program/${program?.uid}`">edit</router-link>
            <p>{{program?.description}}</p>
          </a-card>
        </div>
      </div>
      <div class="row mb-5 pb-5 w-100 justify-content-center align-items-center">
        <div v-if="getPrograms?.programs" class="col-4 my-2">
          <Card @click="showModal" class="addProgram border rounded d-flex justify-content-center align-items-center pointer">
            <a-icon type="plus-circle" theme="twoTone" />
            <p class="text-primary">Add a new program</p>
          </Card>
        </div>
      </div>
      
    </div>
  </a-spin>
  <ProgramModal :visible="visible" :closeModal="closeModal" /> 
  </div>
</template> 

<script>
import {Card} from 'ant-design-vue';
import Vue from 'vue';
import {mapActions, mapGetters} from 'vuex';
import { router } from "@/main";
import ProgramModal from '@/components/ProgramModal.vue';


Vue.use(Card);

export default {
    name: "DashboardView",
    components: {
      Card,
      ProgramModal
    },
    data() {
    return {
      visible: false,
      };
    },
    computed: {
      ...mapGetters(["getPrograms"])
    },
    
    mounted(){
      this.getAllPrograms();
    },
    methods: {
    ...mapActions(["getAllPrograms"]),
    handlePush(id){
      router.push(`/program/${id}`)
    },
    showModal() {
      this.visible = true;
    },
    closeModal() {
      this.visible = false;
    },
  },
}
</script>

<style>
.ant-card.addProgram i{
  font-size: 4rem;
}
.ant-card.addProgram > div{
  min-height: 300px;
}
.pointer{
  cursor: pointer;
}
.ant-card{
  transform: all .3s ease-in-out;
}
.ant-card:hover{
  background: #EEE;
}
.addProgram .ant-card-body{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
*{
  font-family: "Montserrat", sans-serif;
}
</style>