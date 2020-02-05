<template>
  <div
    :style="styleObject"
    class="square"
    :class="{
      active: active,
      'active-entry': activeEntry && !active,
      blank: blank
    }"
    @click="$emit('focus')"
    @contextmenu.prevent="$emit('action')"
  >
    {{ blank ? "" : value }}
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
    activeEntry: Boolean,
    blank: Boolean
  },
  computed: {
    styleObject() {
      return {
        fontSize: this.size * 0.6,
        width: this.size + 1,
        height: this.size + 1,
        padding: this.blank ? this.size * 0.1 : 0,
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
.blank::before {
  content: "";
  height: 100%;
  background-color: black;
  display: block;
}
</style>
