<template>
  <div :style="styleObject" class="diagram" v-click-outside="setFocus">
    <CrosswordDiagramSquare
      :square-data="squareData"
      :size="squareSize"
      :active="squareData.id === activeSquare.id"
      :active-entry="isActiveEntry(squareData)"
      v-for="squareData in squares"
      :key="squareData.id"
      @focus="setFocus(squareData)"
    />
  </div>
</template>

<script>
import Vue from "vue";
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
      activeSquare: {},
      activeEntryIndex: 0
    };
  },
  computed: {
    styleObject() {
      return {
        width: this.crosswordData.width * this.squareSize + 1,
        height: this.crosswordData.height * this.squareSize + 1
      };
    },
    squares() {
      return this.crosswordData.squares;
    },
    entries() {
      return this.crosswordData.entries;
    },
    squareIndex() {
      const index = {};
      for (let square of this.squares) {
        index[square.id] = square;
      }
      return index;
    },
    activeEntry() {
      if (!this.activeSquare.entries) return false;
      return this.activeSquare.entries[this.activeEntryIndex];
    }
  },
  mounted() {
    this.getCrosswordData();
  },
  methods: {
    setFocus(squareData) {
      if (squareData && this.activeSquare.id === squareData.id) {
        this.activeEntryIndex =
          (this.activeEntryIndex + 1) % this.activeSquare.entries.length;
      } else if (!squareData) {
        this.activeSquare = {};
      } else {
        this.activeSquare = squareData;
        if (this.activeEntryIndex >= this.activeSquare.entries.length) {
          this.activeEntryIndex = 0;
        }
      }
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
        this.updateEntries();
      });
    },
    updateEntries() {
      for (let entry of this.entries) {
        for (let squareId of entry.squares) {
          let square = this.squareIndex[squareId.id];
          if (!square.entries) {
            Vue.set(square, "entries", []);
          }
          square.entries.push(entry);
        }
      }
    },
    isActiveEntry(square) {
      if (this.activeEntry)
        for (let squareId of this.activeEntry.squares) {
          if (squareId.id === square.id) return true;
        }
      return false;
    },
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
