<template>
  <div
    :style="styleObject"
    class="square"
    :class="{ active: active }"
    @click="$emit('focus')"
  >
    {{ squareData["value"] }}
  </div>
</template>

<script>
export default {
  name: "CrosswordDiagramSquare",
  props: {
    squareData: Object,
    size: Number,
    active: Boolean
  },
  computed: {
    styleObject() {
      return {
        boxSizing: "border-box",
        border: "solid black 1px",
        fontSize: this.size * 0.6,
        width: this.size + 1,
        height: this.size + 1,
        left: this.size * this.squareData["x"],
        top: this.size * this.squareData["y"]
      };
    }
  }
};
</script>

<style scoped>
.square {
  position: absolute;
}
.active {
  background-color: lightblue;
}
</style>
