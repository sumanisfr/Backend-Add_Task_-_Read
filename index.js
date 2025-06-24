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
    if (err) {
      files = [];
    }
    res.render("index", { files: files });
  });
});

app.post("/", function (req, res) {
  fs.readdir(`./files`, function (err, files) {
    if (err) {
      files = [];
    }
    const filteredFiles = files.filter((file) =>
      file.includes(req.body.searchTerm)
    );
    res.render("index", { files: filteredFiles });
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

app.post("/read/:filename", function (req, res) {
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
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.details,
    function (err) {
      if (err) {
        return res.status(500).send("Error creating file.");
      }
      res.redirect("/");
    }
  );
});

app.post("/create/:filename", function (req, res) {
  fs.writeFile(
    `./files/${req.params.filename.split(" ").join("")}.txt`,
    req.body.details,
    function (err) {
      if (err) {
        return res.status(500).send("Error creating file.");
      }
      res.redirect("/");
    }
  );
});

app.get("/edit/:filename", function (req, res) {
  const filePath = Path.join(__dirname, "files", req.params.filename);
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return res.status(404).send("File not found.");
    }
    res.render("edit", { title: req.params.filename, content: data });
  });
});

app.post("/edit/:filename", function (req, res) {
  const filePath = Path.join(__dirname, "files", req.params.filename);
  fs.writeFile(filePath, req.body.details, function (err) {
    if (err) {
      return res.status(500).send("Error updating file.");
    }
    res.redirect("/");
  });
});

app.get("/delete/:filename", function (req, res) {
  const filePath = Path.join(__dirname, "files", req.params.filename);
  fs.unlink(filePath, function (err) {
    if (err) {
      return res.status(404).send("File not found.");
    }
    res.redirect("/");
  });
});

app.post("/delete/:filename", function (req, res) {
  const filePath = Path.join(__dirname, "files", req.params.filename);
  fs.unlink(filePath, function (err) {
    if (err) {
      return res.status(404).send("File not found.");
    }
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server running on port ${PORT}`);
});
