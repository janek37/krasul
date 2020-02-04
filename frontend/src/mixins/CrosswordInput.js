import Vue from "vue";

// depends on CrosswordNavigation

export default {
  data() {
    return {
      values: {}
    };
  },

  mounted() {
    window.addEventListener("keydown", this.inputKeyHandler);
  },

  methods: {
    inputKeyHandler(e) {
      if (e.altKey || e.ctrlKey) return;
      if (this.hasFocus) {
        if (e.key.length === 1 && e.key.toUpperCase() !== e.key.toLowerCase()) {
          this.setActiveValue(e.key);
          this.moveInEntry(1);
        }
        if (e.key === "Backspace") {
          if (this.getValue(this.activeSquare) === "") {
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
    }
  }
};
