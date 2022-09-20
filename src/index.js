import { ObjectId, ObjectID } from "bson";
import express from "express";
import db from "./db.js";
import connect from "./db.js";
import cors from "cors";

const app = express(); //instanciranje aplikacije
app.use(cors());
app.use(express.json());
const port = 3000; //port na kojem će web server slusat

app.get("/sportske-dvorane", async (req, res) => {
  let db = await connect();
  let cursor = await db.collection("sportske-dvorane").find();
  let results = await cursor.toArray();
  res.json(results);
});

app.patch("/sportske-dvorane/:id", async (req, res) => {
  const id = req.params.id;
  const { dan, ekipa } = req.body;

  let db = await connect();
  let dvorana = await db
    .collection("sportske-dvorane")
    .findOne({ _id: new ObjectId(id) });
  let found = dvorana.termini.includes({ dan, ekipa });
  if (found) {
    console.log("AAAAAAAAAAA");
    res.json({});
  }
  let results = await db
    .collection("sportske-dvorane")
    .updateOne(
      { _id: new ObjectId(id) },
      { $addToSet: { termini: { dan, ekipa } } }
    );
  res.json(results);
});

app.delete("/sportske-dvorane/:id", async (req, res) => {
  const id = req.params.id;
  const { dan, ekipa } = req.body;

  let db = await connect();
  let results = await db
    .collection("sportske-dvorane")
    .updateOne(
      { _id: new ObjectId(id) },
      { $pull: { termini: { dan, ekipa } } }
    );
  res.json(results);
});

app.listen(port, () => console.log(`Port listen ${port}`));
