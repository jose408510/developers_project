const express = require('express');

// to user router we need to bring express 
const router = express.Router();

// instead of doing app.get .. we use router.get
// also /test .. means /api/post/test we already included it in server.js 
// this is a Public route

router.get('/test', ( req, res ) => res.json({msg:"Post Works"
}))

module.exports = router;
