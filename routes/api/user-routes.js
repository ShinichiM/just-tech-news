const router = require('express').Router();
const { User } = require('../../models');

// GET  /api/users
// setup API endpoint so when a client makes GET request to /api/users, we select all users from the suer table in DB & send back as JSON
router.get('/', (req, res) => {
    // access User model and rul .findAll() method
    // .findAll() is a method from the MODEL class of SEQUELIZE that is INHERITED from USER CLASS that we made / SAME AS SELECT * FROM users;
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

/// GET /api/users/
router.get('/:id', (req, res) => {
    // .findOne() method from MODEL class of SEQUELIZE inheritied from USER CLASS that returns one peice of data corresponding to the object parameter / SAME AS: SELECT * FROM users WHERE id = 1
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// POST /api/users
router.post('/', (req, res) => {
    // expect {username: '', email: '', password: ''}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// PURT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: '', email: '', password: ''}

    // if req.body has exact key/value pairs to match model, can just use req.body
    User.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this ID' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this ID' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;