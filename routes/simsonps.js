const express = require('express');
const router = express.Router();
const { listsimsonps, listsimsonpsByID, addsimsonps, updateSimsonps, deleteSimsonps, signInUser } = require('../controllers/simsonps');


router.get('/', listsimsonps); // http://localhost:3000/api/v1/simsonps
router.get('/:id', listsimsonpsByID); 
router.post('/', signInUser); 
router.put('/', addsimsonps); 
router.patch('/:id', updateSimsonps);
router.delete('/:id', deleteSimsonps);

module.exports = router;