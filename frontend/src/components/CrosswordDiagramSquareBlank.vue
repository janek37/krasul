<template>
  <div :style="styleObject" class="blank"></div>
</template>

<script>
export default {
  name: "CrosswordDiagramSquareBlank",
  props: {
    squareData: Object,
    size: Number
  },
  computed: {
    styleObject() {
      return {
        fontSize: this.size * 0.6,
        width: this.size + 1,
        height: this.size + 1,
        padding: this.size * 0.1,
        left: this.size * this.squareData["x"],
        top: this.size * this.squareData["y"]
      };
    }
  }
};
</script>

<style scoped>
.blank {
  position: absolute;
  box-sizing: border-box;
  border: solid black 1px;
}
.blank::before {
  content: "";
  height: 100%;
  background-color: black;
  display: block;
}
</style>
