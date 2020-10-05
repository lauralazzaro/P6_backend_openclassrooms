// handles CRUD operation for sauces
const Sauce = require('../models/sauceModel');
const fs = require('fs');

//SEARCH FOR ALL SAUCES IN DB
exports.getAllSauces = (req, res) => {
    Sauce.find().then(
        (sauces) => { res.status(200).json(sauces); }
    ).catch(
        (error) => {
            res.status(400).json({ error: error });
        }
    );
};

// SEARCH FOR ONE SPECIFIC SAUCE
exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id }
    ).then(
        (sauces) => { res.status(200).json(sauces); }
    ).catch(
        (error) => res.status(400).json({ error: error }));
};

// UDPDATE SAUCE ENTRY 
exports.updateSauce = (req, res) => {
    const sauce = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne(
        { _id: req.params.id },
        { ...sauce, _id: req.params.id }
    ).then(
        () => res.status(200).json({ message: 'Sauce updated!' })
    ).catch(
        (error) => res.status(400).json({ error: error }));
};

// DELETE ONE SAUCE
exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce deleted!'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};

// CREATE NEW SAUCE IN DB
exports.createSauce = (req, res, next) => {
    const sauce = JSON.parse(req.body.sauce);
    delete sauce._id;
    const newSauce = new Sauce({
      ...sauce,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    newSauce.save()
      .then(() => res.status(201).json({ message: 'New sauce created!' }))
      .catch(error => res.status(400).json({ error }));
  };

// ADD LIKES OR DISLIKES FROM USERS
exports.likes = () => { };
