const express = require("express");
const app = express();
const Path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.set("views", Path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(Path.join(__dirname, "public")));

app.get("/", function (req, res) {
  fs.readdir(`./files`, function (err, files) {
    res.render("index", { files: files });
  });
});

app.get("/read/:filename", function (req, res) {
  const filePath = Path.join(__dirname, "files", req.params.filename);

  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return res.status(404).send("File not found.");
    }
    res.render("read", { title: req.params.filename, content: data });
  });
});

app.post("/create", function (req, res) {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join(" ")}.txt`,
    req.body.details,
    function (err) {
      // if (err) throw err;
      res.redirect("/");
    }
  );
});

app.listen(3000, function () {
  console.log("Server is running on http://localhost:3000");
});
