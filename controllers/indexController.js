var router = require('express').Router();
module.exports = router;

router.get('/', function(req, res) {
    res.render('course_form.html');
});