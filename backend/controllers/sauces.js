const sauces = require('../models/sauces');
const fs = require('fs');


exports.getAllSauces = (req, res, next) => {
    sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauces =  (req, res, next) => {
    sauces.findOne({ _id: req.params.id })
        .then(() => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};

exports.createSauces = (req, res, next) => {
    const saucesObject = JSON.parse(req.body.sauces);
    delete saucesObject._id;
    delete saucesObject.userId;
    const sauces = new Sauces({
        ...saucesObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    
    sauces.save()
        .then(() => { res.status(201).json({ message: 'objet enregisté !'})})
        .catch(error => { res.status(400).json({ error })});
};

exports.modifySauces = (req, res, next) => {
    const saucesObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete saucesObject._userId;
    Sauces.findOne({_id: req.params.id})
        .then((sauces) => {
            if (sauces.userId != req.auth.userId) {
                res.status(401).json({ message: 'not authorized'});
            } else {
                Sauces.updateOne({ _id: req.params.id}, { ...saucesObject, _id: req.params.id})
                .then(() => res.status(200).json({ message: 'objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauces =  (req, res, next) => {
    Sauces.findOne({ _id: req.params.id})
        .then(sauces => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message: 'not authorized'});
            } else {
                const filename = thing.imageUrl.split('/image/')[1];
                fs.unlink(`images/${filename}`, () => {
                    sauces.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({ message: 'objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
}

exports.likeSauce = (req, res, next) => {
    

}