<template>
  <div id="app" style="width: 100%; height: 100%; margin: 0;">
    <nav class="navbar navbar-expand navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand mx-auto" v-if="getProgram?.program">{{ getProgram?.program.program[0]?.name}}</a>
        <a class="navbar-brand mx-auto" v-else>Dashboard</a>
      </div>
      <div class="right" v-if="getProgram?.program">
        <router-link to="/">Dashboard</router-link>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapGetters(["getProgram"])
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
