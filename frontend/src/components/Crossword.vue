<template>
  <span>{{ crosswordData }}</span>
</template>

<script>
export default {
  name: "Crossword",
  props: {
    id: String
  },
  data() {
    return {
      crosswordData: {}
    };
  },
  mounted() {
    this.getCrosswordData();
  },
  methods: {
    getCrosswordData() {
      let apiUrl = "/graphql/";
      let config = {
        params: {
          query: `
            {
              crosswords(id: ${parseInt(this.id)}) {
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
  }
};
</script>

<style scoped></style>
