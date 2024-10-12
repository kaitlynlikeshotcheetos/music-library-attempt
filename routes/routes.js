import express from 'express';
import * as ctrl from '../controllers/mainController.js';
import * as auth from '../controllers/authController.js';

const router = express.Router();

router.get('/login', auth.login);
router.post('/login', auth.verifyLogin);
router.get('/logout', auth.logout);
router.get('/register', auth.register);
router.post('/register', auth.verifyRegister);

router.get('/', ctrl.getHome);

router.get('/music', ctrl.getMusic);
router.get('/music/:scoreId', ctrl.getScoreDetails);
router.post('/music/:scoreId/edit', ctrl.updateScoreDetails);
router.post('/music/new', ctrl.createNewScore);
router.delete('/music/:scoreId/delete', ctrl.deleteScore);

export default router;
