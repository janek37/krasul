// assumes properties (data, computed or props):
// width, height, squaresById, entriesBySquareId

export default {
  data() {
    return {
      activeSquare: {},
      activeEntryIndex: 0
    };
  },

  computed: {
    squaresTable() {
      const table = Array.from(Array(this.width), () => new Array(this.height));
      for (let square of Object.values(this.squaresById)) {
        table[square.x][square.y] = square;
      }
      return table;
    },
    hasFocus() {
      return Boolean(this.activeSquare.id);
    },
    activeSquareEntries() {
      return this.entriesBySquareId[this.activeSquare.id];
    },
    activeEntry() {
      if (!this.activeSquareEntries) return false;
      return this.activeSquareEntries[this.activeEntryIndex];
    },
    indexInEntry() {
      if (!this.hasFocus) return -1;
      return this.activeEntry.squareIds.indexOf(this.activeSquare.id);
    }
  },

  mounted() {
    window.addEventListener("keydown", this.navigationKeyHandler);
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
      if (this.activeSquareEntries) {
        this.activeEntryIndex =
          (this.activeEntryIndex + 1) % this.activeSquareEntries.length;
      }
    },

    isActiveEntry(square) {
      if (this.activeEntry)
        return this.activeEntry.squareIds.includes(square.id);
      return false;
    },

    navigationKeyHandler(e) {
      if (e.altKey || e.ctrlKey) return;
      if (this.hasFocus) {
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

    moveInEntry(offset) {
      const targetIndex = this.indexInEntry + offset;
      if (targetIndex < this.activeEntry.squareIds.length && targetIndex >= 0) {
        this.moveToEntryIndex(targetIndex);
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
      let entry = {};
      let oldSquare = {};
      if (this.hasFocus) {
        oldSquare = this.activeSquare;
        entry = this.activeEntry;
      }
      this.activeSquare = square;
      if (this.activeSquareEntries) {
        if (entry) {
          if (!this.setActiveEntry(entry)) {
            for (let entry of this.activeSquareEntries) {
              if (entry.squareIds.includes(oldSquare.id)) {
                this.setActiveEntry(entry);
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

    setActiveEntry(entry) {
      for (let i = 0; i < this.activeSquareEntries.length; i++) {
        if (this.activeSquareEntries[i] === entry) {
          this.activeEntryIndex = i;
          return true;
        }
      }
      return false;
    }
  }
};
