const express = require("express");
const app = express();
const router = require("../server/v1/index.route.js");

app.use(express.json());

app.use("/api", router);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
