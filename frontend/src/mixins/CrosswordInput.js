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
        } else if (e.key === "Backspace") {
          if (this.getValue(this.activeSquare) === "") {
            this.moveInEntry(-1);
          }
          this.setActiveValue("");
        } else if (e.key === "Delete") {
          this.setActiveValue("");
        } else if (e.key === " ") {
          this.setActiveValue("");
          this.moveInEntry(1);
        } else return;
        e.preventDefault();
      }
    },

    setActiveValue(value) {
      this.setValue(this.activeSquare, value.toUpperCase());
    },

    setValue(square, value) {
      Vue.set(this.values, square.id, value);
    },

    getValue(square) {
      return this.values[square.id] || "";
    }
  }
};
