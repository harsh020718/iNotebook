const connectToMongo = require("./db");
const express = require("express");
var cors = require("cors");

connectToMongo();

const app = express();
const port = process.env.PORT || 5000; // Use the environment variable if set, otherwise use port 3000

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`iNotebook app listening on port http://localhost:${port}`);
});

// command to terminate the process
// netstat -ano | findstr :3000
// taskkill /PID <PID> /F

//  npx nodemon .\index.js
