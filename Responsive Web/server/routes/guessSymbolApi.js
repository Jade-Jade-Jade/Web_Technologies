const express = require('express');
const router = express.Router();
var request = require('request');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* GET api listing. */
router.get('/', (req, res) => {
  var options = {
    url: 'http://dev.markitondemand.com/Api/v2/Lookup/json?',
    qs: {
      input: req.query.input
    },
    method: 'GET'
  };
  req.pipe(request(options)).pipe(res);
});


module.exports = router;
