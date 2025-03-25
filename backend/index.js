const express = require('express');
const login = require("./routes/login.js");
const api = require("./routes/api.js");
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

app.use("/", login);
app.use("/", api);

app.use("/storages", express.static(path.join(__dirname, "data_warehouse/thumbnails")));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
