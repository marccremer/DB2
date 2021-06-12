import express from "express";
import kunden from "./kunden";
import reservierungen from "./reservierung";
import coronainfo from "./coronainfo";

const router = express.Router();
router.get("/", async (req, res, next) => {
  res.json({ message: "noo" });
});

router.use("/kunden", kunden);
router.use("/reservierungen", reservierungen);
router.use("/coronainfo", coronainfo);

export default router;
