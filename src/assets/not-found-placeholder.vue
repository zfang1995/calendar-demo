<template>
  <div class="placeholder">
    not found.
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
@import "./varibles.less";
.placeholder {
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  height: 100%;
  width: 100%;
  font-size: larger;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  color: @light-gray;
}
</style>