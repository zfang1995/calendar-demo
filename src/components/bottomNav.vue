<template>
  <div class="bottom-nav list">
    <router-link class="list-item" tag="div" to="/work">
      <span class="iconfont">&#xe62d;</span>
      <span>工作</span>
    </router-link>
    <router-link class="list-item" tag="div" to="/role"
      ><span class="iconfont">&#xe648;</span> <span>角色</span></router-link
    >
    <router-link class="list-item" tag="div" to="/todos"
      ><span class="iconfont">&#xe6f7;</span> <span>事项圈</span></router-link
    >
    <router-link class="list-item" tag="div" to="/mates"
      ><span class="iconfont">&#xe638;</span> <span>同事</span></router-link
    >
    <router-link class="list-item" tag="div" to="/calendar"
      ><span class="iconfont">&#xe66c;</span> <span>日历</span></router-link
    >
  </div>
</template>

<script>
export default {
  name: "bottomNav"
};
</script>

<style lang="less" scoped>
@import "../assets/varibles.less";

.bottom-nav.list {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 14vw;
  box-sizing: border-box;
  padding: 1vw 0;
}
.list-item {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  align-items: center;
  font-size: 3.5vw;
  & > .iconfont {
    font-size: 1.3em;
  }
  &.router-link-exact-active {
    color: @blue;
  }
}
</style>
