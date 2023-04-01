/*global apex */

// Get or Create Namespace
// Please do not polute the global namespace
var holyGrid = holyGrid || {};

(function ($, region) {
  var igModelCreate = "interactivegridviewmodelcreate";

  // Helper Function to give easy subscribe option on a model
  function _subscribe(model, view, callback) {
    model.subscribe({
      onChange: function (type, change) {
        callback(model, view, type, change);
      },
    });
  }

  // Main Function
  // Registers a subscription on the model
  function _registerSubscription(regionId, callback) {
    var myRegion = region(regionId);
    if (myRegion) {
      apex.debug.info("Region found", myRegion);
      var myView = myRegion.call("getCurrentView");
      var existingModel = myView.model;

      if (existingModel) {
        apex.debug.info("Found existing model", existingModel);
        _subscribe(existingModel, myView, callback);
      }

      apex.debug.info("Register model create event handler", regionId);
      $("#" + regionId).on(igModelCreate, function (event, ui) {
        apex.debug.info("New model created", regionId, ui.model);
        _subscribe(ui.model, myView, callback);
      });
    } else {
      apex.debug.warn("Unable to find region", regionId);
    }
  }

  // Expose Functions into Namespace
  holyGrid.ig = holyGrid.ig || {};
  holyGrid.ig.model = {
    register: _registerSubscription,
  };
})(apex.jQuery, apex.region);
