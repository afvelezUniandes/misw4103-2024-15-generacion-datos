const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:2368",
    env: {
      username: "a@a.com",
      password: "ABC1234abc",
      moockarooKey: "ce4699b0",
      moockarooSchema: "test-schema",
    },

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
