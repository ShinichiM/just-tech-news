const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// render('homepage') implies homepage.handlebars whcih looks into /views directory
router.get('/', (req, res) => {
    console.log(req.session);
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal(`(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)`), 'vote_count']
        ],
        include: [{
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User,
                attributes: ['username']
            }
        }, {
            model: User,
            attributes: ['username']
        }
    ]
    })
    .then(dbPostData => {
        // pass a single post object into the homepage template

        // serialize our query data from sequelize before we render through express-handlebars template engine
        // we want .render() to accept an object for later property additions
        // This posts const will be an array
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('homepage', { posts });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

module.exports = router;