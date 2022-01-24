const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// this second router.use() is so if we make a request to any endpoint that doesn't exist
// we receive a 404 error indcating we requested incorrect resource
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;