const sauces = require('../models/sauces');
const fs = require('fs');


exports.getAllSauces = (req, res, next) => {
    sauces.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauces =  (req, res, next) => {
    sauces.findOne({_id: req.params.id})
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};

exports.createSauces = (req, res, next) => {
    const saucesObject = JSON.parse(req.body.sauce);
    delete saucesObject._id;
    delete saucesObject.userId;
    const sauce = new sauces({
        ...saucesObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    
    sauce.save()
        .then(() => { res.status(201).json({ message: 'objet enregisté !'})})
        .catch(error => { res.status(400).json({ error })});
};

exports.modifySauces = (req, res, next) => {
    const saucesObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete saucesObject._userId;
    sauces.findOne({_id: req.params.id})
        .then((response) => {
            if (response.userId != req.auth.userId) {
                res.status(401).json({ message: 'not authorized'});
            } else {
                sauces.updateOne({ _id: req.params.id}, { ...saucesObject, _id: req.params.id})
                .then(() => res.status(200).json({ message: 'objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));   
};

exports.deleteSauces =  (req, res, next) => {
    sauces.findOne({ _id: req.params.id})
        .then(sauces => {
            if (sauces.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized'});
            } else {
                const filename = sauces.imageUrl.split('/image/')[1];
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
    sauces.findOne({_id: req.params.id})
    
    .then((response) => {
        switch(req.body.like) {
            
            case 1 : 

                if(!response.usersLiked.includes(req.body.userId)) 
                {
                    console.log("je suis dans la case 1");
                    sauces.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: req.body.userId}})
                    .then(() => res.status(201).json({ message: "like +1"}))
                    .catch(error => res.status(400).json({ error }));
                }
            break;

            case -1 : 

                if(!response.usersDisliked.includes(req.body.userId)) 
                {
                    console.log("je suis dans la case -1");
                    sauces.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId}})
                    .then(() => res.status(201).json({ message: "dislikes = +1"}))
                    .catch(error => res.status(400).json({ error }));
                }
            break;

            case 0 : 

                if (response.usersLiked.includes(req.body.userId)) 
                {
                    console.log("je suis dans la case 0 likes");
                    sauces.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId}})
                    .then(() => res.status(201).json({ message: "like = 0"}))
                    .catch(error => res.status(400).json({ error }));
                } 
        
                if (response.usersDisliked.includes(req.body.userId)) 
                {
                    console.log("je suis dans la case 0 dislikes");
                    sauces.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId}})
                    .then(() => res.status(201).json({ message: "dislikes = 0"}))
                    .catch(error => res.status(400).json({ error }));
                }
            break;
        }
    })
    .catch(error => res.status(404).json({ error }));    

}