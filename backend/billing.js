const express = require("express");
const router = express.Router();
const prisma = require("./db");  // ✅ Make sure this is imported correctly

router.get("/try", async (req, res) => {
  try {
    const jobs = await prisma.details.findMany();  // ✅ Match this with schema.prisma
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching print jobs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
