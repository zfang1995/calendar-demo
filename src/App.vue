<template>
  <div id="app">
    <router-view class="router-view" />
    <bottomNav class="bottom-nav" />
  </div>
</template>

<script>
import bottomNav from "./components/bottomNav.vue";

export default {
  name: "app",
  components: {
    bottomNav
  }
};
</script>

<style lang="less">
@import "assets/varibles.less";
@import "assets/iconfont/index.css";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  & > .router-view {
    flex-shrink: 1;
    flex-grow: 1;
  }
  & > .bottom-nav {
    bottom: 0;
    left: 0;
    right: 0;
    color: @gray;
    box-shadow: 0 -1px 10px 0px @light-gray;
  }
}
</style>
