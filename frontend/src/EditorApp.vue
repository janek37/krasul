<template>
  <div id="editor">
    <EditorDiagram
      :initial-data="{ width: 7, height: 5, squares: [], entries: [] }"
    />
  </div>
</template>

<script>
import EditorDiagram from "./components/EditorDiagram.vue";

export default {
  name: "app",
  components: {
    EditorDiagram
  }
};
</script>

<style>
#editor {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
}
</style>
