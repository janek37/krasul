<template>
  <div :style="styleObject" class="diagram" v-click-outside="unfocus">
    <CrosswordDiagramSquare
      v-for="square in squaresById"
      :square-data="square"
      :value="getValue(square)"
      :size="squareSize"
      :active="square === activeSquare"
      :active-entry="isActiveEntry(square)"
      :key="square.id"
      @focus="setFocus(square)"
    />
    <CrosswordDiagramSquare
      v-for="squareData in blankSquares"
      :square-data="squareData"
      :size="squareSize"
      :key="squareData.x + ',' + squareData.y"
      :blank="true"
    />
    <div class="clue">{{ activeEntry["clue"] }}</div>
  </div>
</template>

<script>
import CrosswordDiagramSquare from "./CrosswordDiagramSquare";
import ClickOutside from "vue-click-outside";
import CrosswordNavigation from "../mixins/CrosswordNavigation.js";
import CrosswordInput from "../mixins/CrosswordInput.js";

export default {
  name: "CrosswordDiagram",
  components: { CrosswordDiagramSquare },
  directives: { ClickOutside },
  mixins: [CrosswordNavigation, CrosswordInput],

  props: {
    width: Number,
    height: Number,
    rawSquares: Array,
    rawEntries: Array
  },

  data() {
    return {
      squareSize: 40
    };
  },

  computed: {
    styleObject() {
      if (!this.width) return {};
      return {
        width: this.width * this.squareSize + 1,
        height: this.height * this.squareSize + 1
      };
    },
    squaresById() {
      const squaresById = {};
      for (let square of this.rawSquares) {
        squaresById[square.id] = square;
      }
      return squaresById;
    },
    blankSquares() {
      const blanks = [];
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          if (!this.squaresTable[x][y]) blanks.push({ x: x, y: y });
        }
      }
      return blanks;
    },
    entries() {
      const entries = [];
      for (let rawEntry of this.rawEntries) {
        const squareIds = [];
        const entry = { clue: rawEntry.clue, squareIds: squareIds };
        for (let entrySquare of rawEntry.squares) {
          squareIds.push(entrySquare.id);
        }
        entries.push(entry);
      }
      return entries;
    }
  },

  mounted() {
    if (localStorage.values) {
      this.values = JSON.parse(localStorage.values);
    }
  }
};
</script>

<style scoped>
.diagram {
  border: solid black 1px;
  position: relative;
  user-select: none;
}
.clue {
  position: absolute;
  bottom: -30px;
}
</style>
