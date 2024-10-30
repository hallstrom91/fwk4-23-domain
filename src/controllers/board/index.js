const boardCreationController = require("./boardCreationController.js");
const boardManagementController = require("./boardManagementController.js");
const boardFetchingController = require("./boardFetchingController.js");

module.exports = {
  ...boardCreationController,
  ...boardManagementController,
  ...boardFetchingController,
};
