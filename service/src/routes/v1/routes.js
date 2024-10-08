const { Router } = require('express');
const {router: userRouter, routerPath: userRouterPath} = require('../../components/user/routes');
const {router: diceRouter, routerPath: diceRouterPath} = require('../../components/dice/routes');
const {router: tasksRouter, routerPath: tasksRouterPath} = require('../../components/tasks/routes');
const {router: leaderBoardRouter, routerPath: leaderBoardRouterPath} = require('../../components/leaderBoard/routes');

const router = Router();

router.use(userRouterPath, userRouter);
router.use(diceRouterPath, diceRouter);
router.use(tasksRouterPath, tasksRouter);
router.use(leaderBoardRouterPath, leaderBoardRouter);

module.exports = router;
