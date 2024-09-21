const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.BETTERSTACK_NODE_KEY);

module.exports = logtail
