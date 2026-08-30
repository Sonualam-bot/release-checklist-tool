const express = require("express");
const cors = require("cors");
const releaseRoutes = require("./routes/releaseRoutes");
const errorHandler = require("./middleware/errorHandler");

/**
 * Build the Express application (routes + middleware wired up, not listening
 * yet). Separated from server.js so tests can import the app without
 * binding a port.
 * @returns {import("express").Express}
 */
function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api", releaseRoutes);

  app.use(errorHandler);

  return app;
}

module.exports = createApp;
