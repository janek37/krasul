<template>
  <div id="crossword">
    <Crossword id="1" />
  </div>
</template>

<script>
import Crossword from "./components/Crossword.vue";

export default {
  name: "crossword",
  components: {
    Crossword
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
