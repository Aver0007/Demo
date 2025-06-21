const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors({ origin: process.env.BASE_URL }));
app.use(express.json());

function generateShortId() {
  return Math.random().toString(36).substring(2, 8);
}


app.post("/api/shorten", async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) return res.status(400).json({ error: "URL required" });

  const shortId = generateShortId();

  try {
    await pool.query(
      "INSERT INTO urls (short_id, long_url) VALUES ($1, $2)",
      [shortId, longUrl]
    );
    res.json({ shortUrl: `${process.env.BASE_URL}/${shortId}` });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});


app.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;
  try {
    const result = await pool.query(
      "SELECT long_url FROM urls WHERE short_id = $1",
      [shortId]
    );
    if (result.rows.length > 0) {
      res.redirect(result.rows[0].long_url);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (err) {
    res.status(500).send("Error");
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server running at http://localhost:${process.env.PORT}`)
);
