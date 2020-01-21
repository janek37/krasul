<template>
  <div id="crossword">
    <CrosswordDiagram :id="1" />
  </div>
</template>

<script>
import CrosswordDiagram from "./components/CrosswordDiagram.vue";

export default {
  name: "app",
  components: {
    CrosswordDiagram
  }
};
</script>

<style>
#crossword {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
