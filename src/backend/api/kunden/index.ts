import express from "express";
import Knex from "knex";
import { Kunde } from "../../../../db/models/schemas";
import configdb from "../configdb";

const db: Knex = Knex(configdb);

const router = express.Router({
  mergeParams: true,
});

// Spalten in der tabelle
// get all
router.get("/", async (req, res, next) => {
  try {
    db<Kunde>("Kunde")
      .select(
        "Kunde.id",
        "Vorname",
        "Nachname",
        "Alter",
        "Kontaktdaten_id",
        "Adresse_id",
        "EMail",
        "Telefonnummer",
        "strasse",
        "Hausnummer",
        "stadt",
        "zipcode"
      )
      .join("Kontaktdaten", { "Kontaktdaten.id": "Kunde.Kontaktdaten_id" })
      .join("Adresse", { "Adresse.id": "Kontaktdaten.Adresse_id" })
      .then((result) => res.json(result))
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
});

//get 1 by id
router.get("/:kundenid", async (req, res, next) => {
  try {
    const id = req.params.kundenid;
    // TODO: savety check if id is a Integer
    db<Kunde>("Kunde")
      .select(
        "Kunde.id",
        "Vorname",
        "Nachname",
        "Alter",
        "Kontaktdaten_id",
        "Adresse_id",
        "EMail",
        "Telefonnummer",
        "strasse",
        "Hausnummer",
        "stadt",
        "zipcode"
      )
      .join("Kontaktdaten", { "Kontaktdaten.id": "Kunde.Kontaktdaten_id" })
      .join("Adresse", { "Adresse.id": "Kontaktdaten.Adresse_id" })
      .where("Kunde.id", [id])
      .then((result) => {
        res.json(result);
      })
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
});

// create 1
router.post("/", async (req, res, next) => {
  try {
    const newItem: Kunde = req.body;

    db<Kunde>("Kunde")
      .insert(newItem)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  } catch (error) {
    console.log(error);

    next(error);
  }
});

router.patch("/", async (req, res, next) => {
  try {
    const newItem: Kunde = req.body;

    db<Kunde>("Kunde")
      .update(newItem)
      .where("id", [newItem.id])
      .then((result) => res.json(result))
      .catch((err) => {
        console.log(err);
        next(err);
      });
  } catch (error) {
    next(error);
  }
});
router.delete("/:kundenid", async (req, res, next) => {
  try {
    const id = req.params.kundenid;

    db<Kunde>("Kunde")
      .where("id", [id])
      .del()
      .then((result) => res.json(result))
      .catch((err) => {
        console.log(err);
        next(err);
      });
  } catch (error) {
    next(error);
  }
});

export default router;
