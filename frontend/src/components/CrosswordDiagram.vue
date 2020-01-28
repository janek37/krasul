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
      activeEntryIndex: 0,
      squaresById: {}
    };
  },
  computed: {
    width() {
      return this.crosswordData.width;
    },
    height() {
      return this.crosswordData.height;
    },
    styleObject() {
      return {
        width: this.width * this.squareSize + 1,
        height: this.height * this.squareSize + 1
      };
    },
    squares() {
      return this.crosswordData.squares;
    },
    squaresTable() {
      const table = Array.from(Array(this.width), () => new Array(this.height));
      for (let square of this.squares) {
        table[square.x][square.y] = square;
      }
      return table;
    },
    entries() {
      return this.crosswordData.entries;
    },
    activeEntry() {
      if (!this.activeSquare.entries) return false;
      return this.activeSquare.entries[this.activeEntryIndex];
    },
    indexInEntry() {
      if (!this.activeSquare.id) return -1;
      for (let i = 0; i < this.activeEntry.squares.length; i++) {
        if (this.activeEntry.squares[i].id === this.activeSquare.id) {
          return i;
        }
      }
      return -1;
    }
  },
  mounted() {
    this.getCrosswordData();
    window.addEventListener("keydown", this.keyHandler);
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
        this.updateSquaresById();
        this.updateEntries();
      });
    },
    updateSquaresById() {
      for (let square of this.squares) {
        this.squaresById[square.id] = square;
      }
    },
    updateEntries() {
      for (let entry of this.entries) {
        for (let squareId of entry.squares) {
          let square = this.squaresById[squareId.id];
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
    keyHandler(e) {
      if (this.activeSquare.id) {
        console.log(e.key);
        console.log(e);
        if (e.key >= "a" && e.key <= "z") {
          Vue.set(this.activeSquare, "value", e.key);
          if (this.indexInEntry < this.activeEntry.squares.length - 1) {
            this.activeSquare = this.squaresById[
              this.activeEntry.squares[this.indexInEntry + 1].id
            ];
          }
        }
        if (e.key === "ArrowUp") this.move(0, -1);
        if (e.key === "ArrowDown") this.move(0, 1);
        if (e.key === "ArrowLeft") this.move(-1, 0);
        if (e.key === "ArrowRight") this.move(1, 0);
      }
    },
    move(dx, dy) {
      for (
        let x = this.activeSquare.x + dx, y = this.activeSquare.y + dy;
        x >= 0 && y >= 0 && x < this.width && y < this.height;
        x += dx, y += dy
      ) {
        if (this.squaresTable[x][y]) {
          this.activeSquare = this.squaresTable[x][y];
          break;
        }
      }
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
  user-select: none;
  text-transform: uppercase;
}
</style>
