const { Router } = require('express');
const {router: userRouter, routerPath: userRouterPath} = require('../../components/user/routes');
const {router: pointsRouter, routerPath: pointsRouterPath} = require('../../components/points/routes');
const {router: leaderBoardRouter, routerPath: leaderBoardRouterPath} = require('../../components/leaderBoard/routes');
const {router: bonusRouter, routerPath: bonusRouterPath} = require('../../components/bonus/routes');

const router = Router();

router.use(userRouterPath, userRouter);
router.use(pointsRouterPath, pointsRouter);
router.use(leaderBoardRouterPath, leaderBoardRouter);
router.use(bonusRouterPath, bonusRouter);

module.exports = router;
