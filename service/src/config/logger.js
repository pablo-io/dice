const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.BETTERSTACK_KEY);

module.exports = logtail
