<template>
  <div id="crossword">
    <CrosswordDiagram
      :width="crosswordData.width"
      :height="crosswordData.height"
      :raw-squares="crosswordData.squares"
      :raw-entries="crosswordData.entries"
    />
  </div>
</template>

<script>
import CrosswordDiagram from "./components/CrosswordDiagram.vue";

export default {
  name: "app",
  components: {
    CrosswordDiagram
  },
  data() {
    return {
      crosswordData: {
        width: 0,
        height: 0,
        squares: [],
        entries: []
      }
    };
  },
  mounted() {
    this.getCrosswordData(1);
  },
  methods: {
    getCrosswordData(id) {
      let apiUrl = "/graphql/";
      let config = {
        params: {
          query: `
            {
              crosswords(id: ${id}) {
                height
                width
                squares {
                  x
                  y
                  solution
                  id
                }
                entries {
                  clue
                  squares {
                    id
                  }
                }
              }
            }
          `
        }
      };
      return this.$http.get(apiUrl, config).then(response => {
        this.crosswordData = response.data["data"]["crosswords"][0];
      });
    }
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
