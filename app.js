const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

main()
  .then(function () {
    console.log("mongodb started successfully");
  })
  .catch(function (err) {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

  const itemsSchema = {
    name: String,
  };

  const Item = mongoose.model("Item", itemsSchema);

  const item1 = new Item({ name: "Welcome to your todolist!" });
  const item2 = new Item({ name: "Hit the + button to add a new item" });
  const item3 = new Item({ name: "<-- Hit this to delete an item" });
  const defaultItems = [item1, item2, item3];

  const items = ["buy food", "cook food", "eat food"];
  const workItems = [];

  app.get("/", async function (req, res) {
    const result = await Item.find();
    if (result.length === 0) {
      await Item.insertMany(defaultItems);
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItem: result });
    }
  });

  app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newListItem: workItems });
  });
  app.get("/about", function (req, res) {
    res.render("about");
  });

  app.post("/work", function (req, res) {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/");
  });

  app.post("/", function (req, res) {
    const itemName = req.body.newItem;

    const item = new Item({
      name: itemName,
    });
    item.save();
    res.redirect("/");
  });

  app.post("/delete", async function (req, res) {
    const itemId = req.body.checkbox;
    await Item.findByIdAndRemove(itemId);
    res.redirect("/");
  });

  app.listen(3000, function () {
    console.log("server started successfully");
  });

  // mongoose.connection.close();
}
