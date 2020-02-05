<template>
  <div>
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
        @action="removeSquare(square)"
      />
      <CrosswordDiagramSquare
        v-for="squareData in blankSquares"
        :square-data="squareData"
        :size="squareSize"
        :key="squareData.x + ',' + squareData.y"
        :blank="true"
        @focus="addSquare(squareData.x, squareData.y)"
      />
    </div>
    <div
      v-for="entry in entries"
      class="clue-input"
      :key="entry.squareIds.toString()"
    >
      <label :for="'clue' + entry.squareIds.toString()">
        <span v-for="squareId in entry.squareIds" :key="squareId">{{
          values[squareId] || "_"
        }}</span>
        <input
          :id="'clue' + entry.squareIds.toString()"
          :value="clues[entry.squareIds.toString()]"
          @input="setClue(entry, $event.target.value)"
        />
      </label>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
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
    initialData: Object
  },

  data() {
    return {
      width: 0,
      height: 0,
      squareSize: 40,
      squaresById: {},
      clues: {},
      nextId: 1
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
      let currentEntry = [];

      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y <= this.height; y++) {
          if (y < this.height && this.squaresTable[x][y]) {
            currentEntry.push(this.squaresTable[x][y].id);
          } else {
            if (currentEntry.length > 1)
              entries.push({ squareIds: currentEntry });
            currentEntry = [];
          }
        }
      }
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x <= this.width; x++) {
          if (x < this.width && this.squaresTable[x][y]) {
            currentEntry.push(this.squaresTable[x][y].id);
          } else {
            if (currentEntry.length > 1)
              entries.push({ squareIds: currentEntry });
            currentEntry = [];
          }
        }
      }
      return entries;
    }
  },

  mounted() {
    this.loadInitialData();
  },

  methods: {
    loadInitialData() {
      this.width = this.initialData["width"];
      this.height = this.initialData["height"];
      // squares, entries
    },
    addSquare(x, y) {
      const square = { x: x, y: y, value: "", id: this.nextId };
      Vue.set(this.squaresById, square.id, square);
      this.nextId++;
      this.setFocus(square);
    },
    removeSquare(square) {
      Vue.delete(this.squaresById, square.id);
    },
    setClue(entry, value) {
      Vue.set(this.clues, entry.squareIds.toString(), value);
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
