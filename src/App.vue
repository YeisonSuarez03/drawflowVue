<template>
  <div id="app" style="width: 100%; height: 100%; margin: 0;">
    <nav class="navbar navbar-expand navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand mx-auto" v-if="getProgramInfo?.program">{{!getProgramInfo?.loading ? getProgramInfo?.program?.program[0]?.name : "Loading..."}}</a>
        <a class="navbar-brand mx-auto" v-else-if="$route.path === '/'">Dashboard</a>
        <a class="navbar-brand mx-auto" v-else>Loading...</a>
      </div>
      <div class="right px-2" v-if="getProgramInfo?.program">
        <router-link to="/"><a-icon type="logout" /></router-link>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapGetters(["getProgramInfo"])
  },
  methods: {
    ...mapActions(["clearProgram"])
  },
  watch: {
    $route: {
      deep: true,
      handler(to, from) {
        console.log(to, from);
        if (to.path === "/") {
          this.clearProgram()
        }
      },
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
