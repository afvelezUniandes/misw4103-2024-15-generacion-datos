const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:2368",
    env: {
      username: "a@a.com",
      password: "ABC1234abc",
    },

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
