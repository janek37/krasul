<template>
  <div :style="styleObject" class="diagram" v-click-outside="setFocus">
    <CrosswordDiagramSquare
      :square-data="squareData"
      :size="squareSize"
      :active="squareData['id'] === activeSquare['id']"
      v-for="squareData in crosswordData['squares']"
      :key="squareData['id']"
      @focus="setFocus(squareData)"
    />
  </div>
</template>

<script>
import CrosswordDiagramSquare from "./CrosswordDiagramSquare";
import ClickOutside from "vue-click-outside";
export default {
  name: "CrosswordDiagram",
  components: { CrosswordDiagramSquare },
  props: {
    id: Number
  },
  data() {
    return {
      crosswordData: {},
      squareSize: 40,
      activeSquare: {}
    };
  },
  computed: {
    styleObject() {
      return {
        width: this.crosswordData.width * this.squareSize + 1,
        height: this.crosswordData.height * this.squareSize + 1
      };
    }
  },
  mounted() {
    this.getCrosswordData();
  },
  methods: {
    setFocus(squareData) {
      this.activeSquare = squareData;
    },
    getCrosswordData() {
      let apiUrl = "/graphql/";
      let config = {
        params: {
          query: `
            {
              crosswords(id: ${this.id}) {
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
  },
  directives: {
    ClickOutside
  }
};
</script>

<style scoped>
.diagram {
  border: solid black 1px;
  position: relative;
}
</style>
