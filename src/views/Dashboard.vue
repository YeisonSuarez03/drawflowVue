<template>
  <div style="overflow-y: scroll !important;">
    <div class="my-5 container h-100 d-flex justify-content-center align-items-center">
      <div class="row w-100 justify-content-center align-items-center">
        <div class="col-4 my-2" :key="program?.uid" v-for="program in getPrograms?.programs">
          <a-card :title="program?.name">
            <router-link slot="extra" :to="`/program/${program?.uid}`">edit</router-link>
            <p>{{program?.description}}</p>
          </a-card>
        </div>
        <div class="col-4 my-2">
          <Card @click="showModal" class="addProgram border rounded d-flex justify-content-center align-items-center pointer">
            <a-icon type="plus-circle" theme="twoTone" />
            <p class="text-primary">Add a new program</p>
          </Card>
        </div>
      </div>
      <a-modal v-model="visible" title="New Program" @ok="handleOk">
        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
      <a-form-item label="Name">
        <a-input
          v-decorator="['name', { rules: [{ required: true, message: 'Please input the name of your program!' }] }]"
        />
      </a-form-item>
      <a-form-item label="description">
        <a-input
          v-decorator="['Description', { rules: [{ required: true, message: 'Please input the description of your program!' }] }]"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="submit">
          Submit
        </a-button>
      </a-form-item>
    </a-form>
      </a-modal>
    </div>
  </div>
</template> 

<script>
import {Card} from 'ant-design-vue';
import Vue from 'vue';
import {mapActions, mapGetters} from 'vuex';
import { router } from "@/main";


Vue.use(Card);

export default {
    name: "DashboardView",
    data(){
      return{
        visible: false,
        form: this.$form.createForm(this, { name: 'newProgram' }),
      }
    },
    components: {
      Card
    },
    computed: {
      ...mapGetters(["getResult", "getPrograms"])
    },
    watch: {
      getResult(v){
        router.push(`/program/${v?.newprogram}`) 
      }
    },
    mounted(){
      this.getAllPrograms();
    },
    methods: {
    ...mapActions(["createProgram", "getAllPrograms"]),
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.createProgram(values)
        }
      });
    },
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    },
  },
}
</script>

<style>
  body{
    overflow-y: scroll !important;
  }
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