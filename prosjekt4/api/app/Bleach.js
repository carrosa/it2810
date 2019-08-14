import express from 'express';
import * as data from '../db.json';

const BleachRouter = express.Router(); // Get instance of the express router

// Destroy everything
BleachRouter.route('/bleach')
    .post((req, res) => {
      
    });

export default BleachRouter;