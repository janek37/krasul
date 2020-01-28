<template>
  <div
    :style="styleObject"
    class="square"
    :class="{ active: active, 'active-entry': activeEntry && !active }"
    @click="$emit('focus')"
  >
    {{ value }}
  </div>
</template>

<script>
export default {
  name: "CrosswordDiagramSquare",
  props: {
    squareData: Object,
    value: String,
    size: Number,
    active: Boolean,
    activeEntry: Boolean
  },
  computed: {
    styleObject() {
      return {
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
  box-sizing: border-box;
  border: solid black 1px;
}
.active {
  background-color: dodgerblue;
}
.active-entry {
  background-color: lightblue;
}
</style>
