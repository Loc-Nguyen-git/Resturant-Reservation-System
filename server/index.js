const express = require("express");
const PORT = process.env.PORT || 5000;
const app = express();
const mysql = require("mysql");
const cors = require("cors");
/*const bcrypt = require('bcrypt');*/
const bodyParser = require("body-parser");
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "825351",
  port: 3306,
  database: "resturant-reservation-DB",
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/Registration", async (req, res) => {
  try {
    const { name } = req.body;
    const { email } = req.body;
    const { password } = req.body;
    const { address } = req.body;
    const { city } = req.body;
    const { state } = req.body;
    const { zip } = req.body;
    const wholeAddress = address + ", " + city + " " + state + " " + zip;
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (_err, rows, fields) => {
        console.log(rows.length);
        if (rows.length === 0) {
          db.query(
            "INSERT INTO users (name, email, address, password, role) VALUES (?,?,?,?,?)",
            [name, email, wholeAddress, password, "customer"]
          );
          res.json("user registered");
        } else {
          res.json("existed email");
        }
      }
    );
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/login", async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  try {
    
    db.query(
      "SELECT role FROM users WHERE email = ? AND password= ?",
      [email, password],
      (_err, rows, fields) => {
        console.log(rows[0].role);
        if (rows.length === 0) {
          console.log("Invalid Credentials");
          return res.json("Invalid Credentials");
        } else {
          return res.json(rows[0].role);
        }
      }
    );

    /*const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(password, salt);
      console.log(bcryptPassword);
      console.log(signIn.rows[0].password);*/
    /*const validPassword = await bcrypt.compare(password, signIn.rows[0].password);
      console.log(validPassword);
      if(!validPassword){
          console.log("Invalid Credentials");
          return res.status(401).json("Invalid Credentials");
      }*/
    
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
