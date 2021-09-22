/** Server startup for BizTime. */

import app from "./app.js";

const portNum = 3000;

app.listen(portNum, function () {
  console.log(`Server running on port ${portNum}`);
});
