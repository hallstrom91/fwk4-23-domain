const taskCreationController = require("./taskCreationController.js");
const taskManagementController = require("./taskManagementController.js");
const taskFetchingController = require("./taskFetchingController.js");

module.exports = {
  ...taskCreationController,
  ...taskManagementController,
  ...taskFetchingController,
};
