/*global apex */

// Get or Create Namespace
// PLease do not polute the global namespace
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
      var myView = myRegion.call("getCurrentView");
      var existingModel = myView.model;

      if (existingModel) {
        _subscribe(existingModel, myView, callback);
      }

      $("#" + regionId).on(igModelCreate, function (event, ui) {
        _subscribe(ui.model, myView, callback);
      });
    } else {
      console.warn("Region ID " + regionId + " not found.");
    }
  }

  // Expose Functions into Namespace
  holyGrid.ig = holyGrid.ig || {};
  holyGrid.ig.model = {
    register: _registerSubscription,
  };
})(apex.jQuery, apex.region);
