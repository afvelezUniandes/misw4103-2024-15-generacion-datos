const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:2368",
    env: {
      username: "pa.sandoval@uniandes.edu.co",
      password: "Pruebas123",
    },

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});