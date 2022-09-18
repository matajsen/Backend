import express from "express";

import connect from "./db.js"

const app = express(); //instanciranje aplikacije
const port = 3000;  //port na kojem će web server slusat

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(port, () => (
    console.log(`Port listen ${port}`)
))
