<template>
  <div :style="styleObject" class="diagram" v-click-outside="unfocus">
    <CrosswordDiagramSquare
      v-for="square in squaresById"
      :square-data="square"
      :value="getValue(square)"
      :size="squareSize"
      :active="square.id === activeSquare.id"
      :active-entry="isActiveEntry(square)"
      :key="square.id"
      @focus="setFocus(square)"
      @action="removeSquare(square)"
    />
    <CrosswordDiagramSquare
      :square-data="squareData"
      :size="squareSize"
      v-for="squareData in blankSquares"
      :key="squareData.x + ',' + squareData.y"
      :blank="true"
      @focus="addSquare(squareData.x, squareData.y)"
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
    initialData: Object
  },
  data() {
    return {
      width: 0,
      height: 0,
      squareSize: 40,
      activeSquare: {},
      activeEntryIndex: 0,
      squaresById: {},
      values: {},
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
    squaresTable() {
      const table = Array.from(Array(this.width), () => new Array(this.height));
      for (let square of Object.values(this.squaresById)) {
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
    entriesBySquareId() {
      const entriesBySquareId = {};
      let currentEntry = [];

      function setEntry() {
        if (currentEntry.length > 1) {
          const entry = { squareIds: currentEntry };
          for (let squareId of currentEntry) {
            if (!entriesBySquareId[squareId]) entriesBySquareId[squareId] = [];
            entriesBySquareId[squareId].push(entry);
          }
        }
        currentEntry = [];
      }

      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y <= this.height; y++) {
          if (y < this.height && this.squaresTable[x][y]) {
            currentEntry.push(this.squaresTable[x][y].id);
          } else {
            setEntry();
          }
        }
      }
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x <= this.width; x++) {
          if (x < this.width && this.squaresTable[x][y]) {
            currentEntry.push(this.squaresTable[x][y].id);
          } else {
            setEntry();
          }
        }
      }
      return entriesBySquareId;
    },
    activeSquareEntries() {
      return this.entriesBySquareId[this.activeSquare.id];
    },
    activeEntry() {
      if (!this.activeSquareEntries) return false;
      return this.activeSquareEntries[this.activeEntryIndex];
    },
    indexInEntry() {
      if (!this.activeSquare.id) return -1;
      return this.activeEntry.squareIds.indexOf(this.activeSquare.id);
    }
  },
  mounted() {
    window.addEventListener("keydown", this.keyHandler);
    this.loadInitialData();
  },
  methods: {
    loadInitialData() {
      this.width = this.initialData["width"];
      this.height = this.initialData["height"];
      // squares, entries
    },
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
        (this.activeEntryIndex + 1) % this.activeSquareEntries.length;
    },
    isActiveEntry(square) {
      if (this.activeEntry)
        return this.activeEntry.squareIds.includes(square.id);
      return false;
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
    keyHandler(e) {
      if (e.altKey || e.ctrlKey) return;
      if (this.activeSquare.id) {
        if (e.key.length === 1 && e.key.toUpperCase() !== e.key.toLowerCase()) {
          this.setActiveValue(e.key);
          this.moveInEntry(1);
        }
        if (e.key === "Backspace") {
          if (this.activeSquare.value === "") {
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
      if (this.activeSquareEntries) {
        if (entry) {
          if (!this.setEntry(entry)) {
            for (let entry of this.activeSquareEntries) {
              if (entry.squareIds.includes(oldSquare.id)) {
                this.setEntry(entry);
                return;
              }
            }
          }
        }
        if (this.activeEntryIndex >= this.activeSquareEntries.length) {
          this.activeEntryIndex = 0;
        }
      }
    },
    setEntry(entry) {
      for (let i = 0; i < this.activeSquareEntries.length; i++) {
        if (this.activeSquareEntries[i] === entry) {
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
