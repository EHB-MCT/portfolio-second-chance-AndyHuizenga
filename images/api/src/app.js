const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send({message: "Hello, World!"});
})

app.listen(5502, (err) => {
  if (!err) {
    console.log("Server is running at http://localhost:5502");
    
  } else {
    console.error(err);
  }
})


