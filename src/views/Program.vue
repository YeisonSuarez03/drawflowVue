<template>
  <div class="drawflow-container">
    <a-spin tip="Loading..." :spinning="getProgramInfo?.loading || getResults?.loading" style="width: 100%; height: 100vh;">
    <div class="wrapper">
      <aside>
        <ul class="list-group">
          <div
            draggable="true"
            @dragstart="(e) => drag(e)"
            
            data-node="variable"
            class="list-group-item list-group-item-action drag-drawflow variable"
          >
          <i class="fa-regular fa-cube"></i>
          <span>
            Variable
          </span>
        </div>
          <div
            draggable="true"
            @dragstart="(e) => drag(e)"
            
            data-node="math-operation"
            class="list-group-item list-group-item-action drag-drawflow math-operation"
          >
          <i class="fa-solid fa-calculator"></i>
            <span>Math Operation</span>
        </div>
          <div
            draggable="true"
            @dragstart="(e) => drag(e)"
            
            data-node="assign"
            class="list-group-item list-group-item-action drag-drawflow assign"
          >
          <i class="fa-solid fa-equals"></i>
          <span>
            Assign
          </span>
        </div>
          <div
            draggable="true"
            @dragstart="(e) => drag(e)"
            
            data-node="if-else"
            class="list-group-item list-group-item-action drag-drawflow if-else"
          >
          <i class="fa-regular fa-split"></i>
          <span>
            If-Else
          </span>
        </div>
          <div
            draggable="true"
            @dragstart="(e) => drag(e)"
            
            data-node="for-loop"
            class="list-group-item list-group-item-action drag-drawflow for-loop"
          >
          <i class="fa-regular fa-hurricane"></i>
          <span>
            For Loop
          </span>
        </div>
          <div
            draggable="true"
            @dragstart="(e) => drag(e)"
            
            data-node="code-block"
            class="list-group-item list-group-item-action drag-drawflow code-block"
          >
          <i class="fa-solid fa-code"></i>
          <span>
            Code Block
          </span>
        </div>
        </ul>
      </aside>
      <main>
        <div class="drawflow-actions">
          <button @click="exportData" class="btn btn-success">Save</button>
        </div>
        <div class="drawflow-code">
          <div>
          <a-spin tip="Loading..." :spinning="getCodeResults?.loading">
          <div>
            <h6>Python Code:</h6>
            <pre class="ps-3 pt-2"><code>{{getCode}}</code></pre>
            <div class="d-flex flex-column">
              <div>
                <button @click="handleGenerateCode" class="btn btn-primary me-2" style="max-width: 150px;">Generate code</button>
                <button @click="handleExecuteCode" class="btn btn-danger" style="max-width: 150px;">Execute</button>
              </div>
              <strong class="mt-2">Output: </strong>
              <p>{{JSON.stringify(getCodeResults?.result?.data, null, 2)}}</p>
            </div>
          </div>
        </a-spin>
      </div>

        </div>
        <div
          id="drawflow"
          class="parent-drawflow"
          @drop="(e) => drop(e)" @dragover="(e) => allowDrop(e)"
        ></div>
      </main>
    </div>
  </a-spin>
  </div>
</template>

<script>
import Drawflow from "drawflow";
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { responseNotification } from "../helpers/responseNotification";

export default {
  name: "ProgramView",
  data() {
    return {
      mobile_item_selec: "",
      mobile_last_move: null,
      isMounted: false,
    };
  },
  computed: {
    ...mapGetters(["getProgramInfo", "getResults", "getCode", "getCodeResults"])
  },
  watch: {
    getResults(v){
      console.log(v);
      !v?.loading && responseNotification(v?.result, "The program has been saved succesfully!")
    }
  },
  async mounted() {
    this.isMounted = true
    await this.getProgramById(this.$route.params.id)
    const id = document.getElementById("drawflow");
    Vue.prototype.$df = new Drawflow(id, Vue, this);
    this.$df.reroute = true;
    // this.$df.reroute_fix_curvature = true;
    // this.$df.force_first_input = true; */
    this.$df.start();
    this.$df.import(JSON.parse(this.getProgramInfo?.program.program[0]?.drawflow)); 
    var elements = document.getElementsByClassName("drag-drawflow");
      for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("touchend", this.drop, false);
        elements[i].addEventListener("touchmove", this.positionMobile, false);
        elements[i].addEventListener("touchstart", this.drag, false);
      }
  },
  methods: {
      ...mapActions(["getProgramById", "updateProgram", "executeCode", "changeCode"]),
      exportData(){
        let exportdata = {
          uid: window.location.href.split("/").at(-1),
          drawflow: JSON.stringify(this.$df.export())
        };
        this.updateProgram(exportdata)
      },
      handleExecuteCode(){
        this.executeCode(this.getCode)
      },
      handleGenerateCode(){
        let data = JSON.stringify(this.$df.export())
        console.log(data);
        let code = "x=1\ny=2\nprint(x+y)"
        this.changeCode(code)
      },
      positionMobile(ev){
        this.mobile_last_move = ev;
      },
      allowDrop(e){
        e.preventDefault()
      },
      drag(ev){
        if (ev.type === "touchstart") {
          this.mobile_item_selec = ev.target
            .closest(".drag-drawflow")
            .getAttribute("data-node");
        } else {
          ev.dataTransfer.setData("node", ev.target.getAttribute("data-node"));
        }
      },
      drop(ev){
        if (ev.type === "touchend") {
          var parentdrawflow = document
            .elementFromPoint(
              this.mobile_last_move.touches[0].clientX,
              this.mobile_last_move.touches[0].clientY
            )
            .closest("#drawflow");
          if (parentdrawflow != null) {
            this.addNodeToDrawFlow(
              this.mobile_item_selec,
              this.mobile_last_move.touches[0].clientX,
              this.mobile_last_move.touches[0].clientY
            );
          }
          this.mobile_item_selec = "";
        } else {
          ev.preventDefault();
          var data = ev.dataTransfer.getData("node");
          this.addNodeToDrawFlow(data, ev.clientX, ev.clientY);
        }
      },
      addNodeToDrawFlow(name, pos_x, pos_y) {
        console.log(this.$df);
        if (this.$df.editor_mode === "fixed") {
          return false;
        }
        pos_x =
          pos_x *
            (this.$df.precanvas.clientWidth /
              (this.$df.precanvas.clientWidth * this.$df.zoom)) -
          this.$df.precanvas.getBoundingClientRect().x *
            (this.$df.precanvas.clientWidth /
              (this.$df.precanvas.clientWidth * this.$df.zoom));
        pos_y =
          pos_y *
            (this.$df.precanvas.clientHeight /
              (this.$df.precanvas.clientHeight * this.$df.zoom)) -
          this.$df.precanvas.getBoundingClientRect().y *
            (this.$df.precanvas.clientHeight /
              (this.$df.precanvas.clientHeight * this.$df.zoom));
        let html = "";
        let data = {};
        let inputs = 0;
        let outputs = 1;

        switch (name) {
          case "variable":
            html = `
        <div>
          <div class="title-box variable"><i class="fa-regular fa-cube"></i>Variable</div>
          <div class="box">
            <p>Type Variable name</p>
            <input type="text" df-name placeholder="var1" />
            <p>Type Variable value</p>
            <input type="number" df-value placeholder="2" />
          </div>
        </div>
        `;
        data = {name: "", value: ""}
            
            break;
          case "math-operation":
            html = `
          <div>
            <div class="title-box math-operation"><i class="fa-solid fa-calculator"></i>Math Operation</div>
            <div class="box">
              <p>Connect two variables, then select the operation you want to execute:</p>
              <select df-operation>
                <option value="add">Add</option>
                <option value="substract">Substract</option>
                <option value="multiply">Multiply</option>
                <option value="divide">Divide</option>
              </select>
            </div>
          </div>
          `;
          data = {operation: null}
          inputs = 2;
          outputs = 1
            break;
          case "assign":
            html = `
          <div>
            <div class="title-box assign"><i class="fa-solid fa-equals"></i>Assign</div>
            <div class="box">
              <p>Connect a variable node or a math operation node, then type the new variable name</p>
            <input type="text" df-name>
            </div>
          </div>
          `;
            data = {name: ""}
            inputs = 1;
            outputs = 1;
            break;
          case "if-else":
            html = `
          <div>
            <div class="title-box if-else"><i class="fa-regular fa-split"></i>If-Else</div>
            <div class="box">
              <p>Connect two variables, then select the conditional operator to compare them. First output will be executed if condition equals true, the other one will be executed if condition equals false</p>
              <p>Select Conditional Operator:</p>
              <select df-operator>
                <option value="equals">Equals (=)</option>
                <option value="different">Different (!=)</option>
                <option value="minor">Minor than (<)</option>
                <option value="minor-equal">Minor or equal than (<=)</option>
                <option value="major">Major than (>)</option>
                <option value="major-equal">Major or equal than (>=)</option>
              </select>
            </div>
          </div>
          `;
            data = {operator: null}
            inputs = 1;
            outputs = 2;
            break;
          case "for-loop":
            html = `
          <div>
            <div class="title-box for-loop"><i class="fa-regular fa-hurricane"></i> For Loop </div>
            <div class="box">
              <p>Please type how many times you want the loop to iterate</p>
              <input type="number" df-times>
            </div>
          </div>
          `;
            data = {times: null}
            inputs = 1;
            outputs = 1;
            break;
          case "code-block":
            html = `
            <div>
              <div class="title-box code-block"><i class="fa-solid fa-code"></i>Code block </div>
              <div class="box">
                <p>Type your own custom code</p>
                <textarea df-customcode rows="10" cols="5"  />
              </div>

            </div>
            `;
            data = {customcode: ""}
            inputs = 1
            break;
          default:
        }
        this.$df.addNode( name, inputs, outputs, pos_x, pos_y, `${name}-nodecontainer`, data, html); 
      }
  },
};
</script>

<style>
#drawflow {
  position: relative;
    width: calc(100vw - 201px);
    height: calc(100%);
    top: 0px;
    background: var(--background-color);
    background-size: 25px 25px;
    background-image: linear-gradient(to right, #f1f1f1 1px, transparent 1px), linear-gradient(to bottom, #f1f1f1 1px, transparent 1px);
}

.drawflow-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.drag-drawflow {
  cursor: move;
  user-select: none;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  color: #fff;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  transform: all .5s ease-in-out;
}

.drag-drawflow:hover{
  color: #DDD;
}
.drag-drawflow:hover i{
  animation: rotate .5s ease-out;
}

@keyframes rotate {
  from{
    transform: rotate(0deg);
  }
  to{
    transform: rotate(360deg);
  }
}

.title-box{
  color: #fff;
  display: flex;
  gap: .5em;
  align-items: center;
  justify-content: center;
}

.variable{
  background: linear-gradient(90deg, rgb(235, 149, 28) 0%, rgba(214,103,7,1) 100%) !important;
}

.math-operation{
  background: linear-gradient(90deg, rgba(37,2,195,1) 0%, rgba(83,14,144,1) 100%) !important;
}

.assign{
  background: linear-gradient(90deg, rgba(48,195,2,1) 0%, rgba(14,144,129,1) 100%) !important;
}

.if-else{
  background: linear-gradient(90deg, rgba(207,85,25,1) 0%, rgba(217,18,86,1) 100%) !important;
}

.for-loop{
  background: linear-gradient(90deg, rgba(25,115,207,1) 0%, rgba(14,174,180,1) 100%) !important;
}

.code-block{
  background: linear-gradient(90deg, rgba(205,212,31,1) 0%, rgba(152,180,14,1) 100%) !important;
}
.code-block-nodecontainer{
  width: 300px !important;
}
.code-block-nodecontainer .drawflow_content_node{
  min-height: 300px !important;
}
.code-block-nodecontainer textarea{
  width: 100%;
  height: 100%;
}
.wrapper {
    width: 100%;
    height: calc(100vh - 67px);
    display: flex;
}

nav {
  z-index: 100;
  box-shadow: 2px 5px 20px #33333350;
}

aside {
  width: 20%;
  height: 100%;
}
main {
  position: relative;
  width: 80%;
  height: 100%;
}

.drawflow-actions{
  position: absolute;
  right: 5%;
  top: 5%;
  z-index: 10;
}

.drawflow-code{
  position: absolute;
    right: 5%;
    bottom: 5%;
    z-index: 10;
    width: 100%;
    max-width: 300px;
    min-width: 200px;
    height: 100%;
    max-height: 300px;
    min-height: 250px;
}
.drawflow-code > div:first-child{
  background-color: #FFF;
  padding: 1rem;
  border: 1px solid #AAAAAA70;
  box-shadow: 0 0 20px 5px #aaaaaa70;
  border-radius: 15px;
  width: 100%;
  height: 100%;
}
.drawflow-code pre{
  overflow-y: scroll;
  height: 100%;
  min-height: 100px;
  max-height: 150px;
  background: #333;
  color: #F7F7F7;
}

/* .drawflow .connection {
    position: initial;
}
.drawflow svg {
    position: initial;
} */
</style>