import express from "express";
import kunden from "./kunden";

const router = express.Router();
router.get("/", async (req, res, next) => {
  res.json({ message: "noo" });
});

router.use("/kunden", kunden);

export default router;
