<template>
  <div :style="styleObject" class="diagram" v-click-outside="unfocus">
    <CrosswordDiagramSquare
      :square-data="square"
      :value="getValue(square)"
      :size="squareSize"
      :active="square === activeSquare"
      :active-entry="isActiveEntry(square)"
      v-for="square in squares"
      :key="square.id"
      @focus="setFocus(square)"
    />
    <CrosswordDiagramSquare
      :square-data="squareData"
      :size="squareSize"
      v-for="squareData in blankSquares"
      :key="squareData.x + ',' + squareData.y"
      :blank="true"
    />
    <div class="clue">{{ activeEntry["clue"] }}</div>
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
    width: Number,
    height: Number,
    rawSquares: Array,
    rawEntries: Array
  },
  data() {
    return {
      squareSize: 40,
      activeSquare: {},
      activeEntryIndex: 0,
      values: {}
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
    squares() {
      if (!this.rawSquares) return [];
      const squares = [];
      for (let square of this.rawSquares) {
        squares.push({ x: square.x, y: square.y, id: square.id });
      }
      const squaresById = {};
      for (let square of squares) {
        squaresById[square.id] = square;
      }
      for (let entry of this.entries) {
        for (let squareId of entry.squareIds) {
          const square = squaresById[squareId];
          if (!square.entries) {
            Vue.set(square, "entries", []);
          }
          square.entries.push(entry);
        }
      }
      return squares;
    },
    squaresById() {
      const squaresById = {};
      for (let square of this.squares) {
        squaresById[square.id] = square;
      }
      return squaresById;
    },
    squaresTable() {
      const table = Array.from(Array(this.width), () => new Array(this.height));
      for (let square of this.squares) {
        table[square.x][square.y] = square;
      }
      return table;
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
      for (let entry of this.rawEntries) {
        const squareIds = [];
        for (let entrySquare of entry.squares) {
          squareIds.push(entrySquare.id);
        }
        entries.push({ clue: entry.clue, squareIds: squareIds });
      }
      return entries;
    },
    activeEntry() {
      if (!this.activeSquare.entries) return false;
      return this.activeSquare.entries[this.activeEntryIndex];
    },
    indexInEntry() {
      if (!this.activeSquare.id) return -1;
      return this.activeEntry.squareIds.indexOf(this.activeSquare.id);
    }
  },
  mounted() {
    window.addEventListener("keydown", this.keyHandler);
    if (localStorage.values) {
      this.values = JSON.parse(localStorage.values);
    }
  },
  methods: {
    setFocus(square) {
      if (square && this.activeSquare === square) {
        this.cycleEntry();
      } else {
        this.moveToSquare(square);
      }
    },
    unfocus() {
      this.activeSquare = {};
    },
    cycleEntry() {
      this.activeEntryIndex =
        (this.activeEntryIndex + 1) % this.activeSquare.entries.length;
    },
    isActiveEntry(square) {
      if (this.activeEntry)
        return this.activeEntry.squareIds.includes(square.id);
      return false;
    },
    keyHandler(e) {
      if (e.altKey || e.ctrlKey) return;
      if (this.activeSquare.id) {
        if (e.key.length === 1 && e.key.toUpperCase() !== e.key.toLowerCase()) {
          this.setActiveValue(e.key);
          this.moveInEntry(1);
        }
        if (e.key === "Backspace") {
          if (this.getValue(this.activeSquare).length === 0) {
            this.moveInEntry(-1);
          }
          this.setActiveValue("");
        }
        if (e.key === "Delete") {
          this.setActiveValue("");
        }
        if (e.key === " ") {
          this.setActiveValue("");
          this.moveInEntry(1);
        }
        if (e.key === "Enter") {
          this.cycleEntry();
        }
        if (e.key === "Home") {
          this.moveToEntryIndex(0);
        }
        if (e.key === "End") {
          this.moveToEntryIndex(-1);
        }
        if (e.key === "ArrowUp") this.move(0, -1);
        if (e.key === "ArrowDown") this.move(0, 1);
        if (e.key === "ArrowLeft") this.move(-1, 0);
        if (e.key === "ArrowRight") this.move(1, 0);
      }
    },
    setActiveValue(value) {
      this.setValue(this.activeSquare, value);
    },
    setValue(square, value) {
      Vue.set(this.values, square.id, value);
      localStorage.values = JSON.stringify(this.values);
    },
    getValue(square) {
      return this.values[square.id] || "";
    },
    moveInEntry(offset) {
      if (
        this.indexInEntry + offset < this.activeEntry.squareIds.length &&
        this.indexInEntry + offset >= 0
      ) {
        this.moveToEntryIndex(this.indexInEntry + offset);
      }
    },
    moveToEntryIndex(index) {
      if (index < 0) index += this.activeEntry.squareIds.length;
      this.moveToSquare(this.squaresById[this.activeEntry.squareIds[index]]);
    },
    move(dx, dy) {
      for (
        let x = this.activeSquare.x + dx, y = this.activeSquare.y + dy;
        x >= 0 && y >= 0 && x < this.width && y < this.height;
        x += dx, y += dy
      ) {
        if (this.squaresTable[x][y]) {
          this.moveToSquare(this.squaresTable[x][y]);
          break;
        }
      }
    },
    moveToSquare(square) {
      let entry = null;
      let oldSquare = null;
      if (this.activeSquare) {
        oldSquare = this.activeSquare;
        entry = this.activeEntry;
      }
      this.activeSquare = square;
      if (entry) {
        if (!this.setEntry(entry)) {
          for (let entry of this.activeSquare.entries) {
            if (entry.squareIds.includes(oldSquare.id)) {
              this.setEntry(entry);
              return;
            }
          }
        }
      }
      if (this.activeEntryIndex >= this.activeSquare.entries.length) {
        this.activeEntryIndex = 0;
      }
    },
    setEntry(entry) {
      for (let i = 0; i < this.activeSquare.entries.length; i++) {
        if (this.activeSquare.entries[i] === entry) {
          this.activeEntryIndex = i;
          return true;
        }
      }
      return false;
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
}
.clue {
  position: absolute;
  bottom: -30px;
}
</style>
