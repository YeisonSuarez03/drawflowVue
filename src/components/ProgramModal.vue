<template>
  <a-modal @cancel="closeModal" :visible="visible" :title="getProgramInfo?.program?.program[0]?.name ? 'Update Program Info' : 'New Program'" @ok="handleSubmit">
    <a-spin tip="Loading..." :spinning="getProgramInfo?.loading || getResults?.loading">
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        @submit="handleSubmit"
      >
        <a-form-item label="Name">
          <a-input
            v-decorator="[
              'name',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please input the name of your program!',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="description">
          <a-input
            v-decorator="[
              'Description',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please input the description of your program!',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit"> Submit </a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { responseNotification } from "@/helpers/responseNotification";
import { router } from "@/main";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ProgramModal",
  props: {
    "visible": Boolean,
    "closeModal": Function
},
  data() {
    return {
      form: this.$form.createForm(this, { name: "newProgram" }),
    };
  },
  computed: {
    ...mapGetters(["getResults", "getProgramInfo"]),
  },
  watch: {
    getResults(v) {
      console.log(v);
      if (!v.loading) {
        responseNotification(v?.result);
        router.push(`/program/${v?.result?.data?.newprogram}`);
      }
    },
    visible: function(){
        if (this.getProgramInfo?.program) {     
            this.form.setFieldsValue({
                name: this.getProgramInfo?.program?.program[0]?.name,
                description: this.getProgramInfo?.program?.program[0]?.description
            })
        }
    }
  },
  methods: {
    ...mapActions(["createProgram"]),
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.createProgram(values);
        }
      });
    },
    
  },

};
</script>

<style>
</style>