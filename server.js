/** Server startup for BizTime. */

const app = require("./app");

const portNum = 3000;

app.listen(portNum, function () {
  console.log(`Server running on port ${portNum}`);
});
