const express = require("express");
const router = express.Router();
const db = require("../config/db");
const Gig = require("../models/Gig");
const sequelize = require("sequelize");
const Op = sequelize.Op;

// get a gig list
router.get("/", (req, res) => {
  Gig.findAll()
    .then((gigs) => {
      res.render("gigs", { gigs });
      console.log(gigs);
    })
    .catch((err) => {
      console.log(err);
    });
});

//Display add gig form
router.get("/add", (req, res) => {
  res.render("add");
});

//add a gig
router.post("/add", (req, res) => {
  let { title, technologies, budget, description, contact_email } = req.body;
  let errors = [];
  if (!title) {
    errors.push({ text: "please add a title" });
  }
  if (!technologies) {
    errors.push({ text: "please add technologies" });
  }
  if (!description) {
    errors.push({ text: "please add a description" });
  }
  if (!contact_email) {
    errors.push({ text: "please add a contact email" });
  }

  //check for errors
  if (errors.length > 0) {
    res.render("add", {
      errors,
      title,
      technologies,
      budget,
      description,
      contact_email,
    });
  } else {
    if (!budget) {
      budget = "Unknown";
    } else {
      budget = `$${budget}`;
    }
    //make lowercase and remove space after coma
    technologies = technologies.toLowerCase().replace(/, /g, ",");

    //insert into table
    Gig.create({
      title,
      technologies,
      budget,
      description,
      contact_email,
    })
      .then((gigs) => {
        res.redirect("/gigs");
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

//search for gigs
router.get("/search", (req, res) => {
  let { term } = req.query;

  //make lowercase
  term = term.toLowerCase();

  Gig.findAll({ where: { technologies: { [Op.like]: "%" + term + "%" } } })
    .then((gigs) => res.render("gigs", { gigs }))
    .catch((err) => console.log(err));
});

module.exports = router;
