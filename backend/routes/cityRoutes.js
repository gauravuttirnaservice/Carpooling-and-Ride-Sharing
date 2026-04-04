import express from 'express';
import { getPopularCities } from '../controllers/cityController.js';

const router = express.Router();

router.get('/popular', getPopularCities);

export default router;
