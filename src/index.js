import { ObjectId, ObjectID } from "bson";
import express from "express";
import db from "./db.js";
import connect from "./db.js";
import cors from "cors";

const app = express(); //instanciranje aplikacije
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000; //port na kojem će web server slusat

app.get("/sportske-dvorane", async (req, res) => {
  let db = await connect();
  let cursor = await db.collection("sportske-dvorane").find();
  let results = await cursor.toArray();
  res.json(results);
});

app.patch("/sportske-dvorane/:id", async (req, res) => {
  const id = req.params.id;
  const { datum, ekipa, termin } = req.body;

  let db = await connect();
  let dvorana = await db
    .collection("sportske-dvorane")
    .findOne({ _id: new ObjectId(id) });
  if (dvorana.hasOwnProperty("termin")) {
    let found = dvorana.termini.filter(
      (zakazano) =>
        zakazano.datum === datum &&
        zakazano.ekipa === ekipa &&
        zakazano.termin === termin
    );
    if (found.lenght) {
      res.json({});
      return;
    }
  }
  let results = await db
    .collection("sportske-dvorane")
    .updateOne(
      { _id: new ObjectId(id) },
      { $addToSet: { termini: { datum, ekipa, termin } } }
    );
  res.json(results);
});

app.delete("/sportske-dvorane/:id", async (req, res) => {
  const id = req.params.id;
  const { datum, ekipa } = req.body;

  let db = await connect();
  let results = await db
    .collection("sportske-dvorane")
    .updateOne(
      { _id: new ObjectId(id) },
      { $pull: { termini: { datum, ekipa, temrmin } } }
    );
  res.json(results);
});

app.get("/timovi", async (req, res) => {
  let db = await connect();
  let cursor = await db.collection("timovi").find();
  let results = await cursor.toArray();
  res.json(results);
});

app.listen(port, () => console.log(`Port listen ${port}`));
