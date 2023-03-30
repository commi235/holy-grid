/*
Not that this will interfere with the inbuilt highlighting!
*/

/* global apex */

var holyGrid = holyGrid || {};

(function (region, message, lang) {
  const fieldName = "COMM";
  var _regionId;

  function _getHighlight(value) {
    var highlightClass;
    apex.debug.info("Value", value);
    if (value == 0) {
      highlightClass = "";
    } else if (value > 0 && value <= 500) {
      highlightClass = "u-success";
    } else if (value > 500 && value <= 1000) {
      highlightClass = "u-warning";
    } else {
      highlightClass = "u-danger";
    }
    apex.debug.info("Highlight", highlightClass);
    return highlightClass;
  }

  function _updateHighlight(model, view, type, change) {
    if (change.field == fieldName && type == "set") {
      apex.debug.info("Change", change);
      const meta = model.getRecordMetadata(change.recordId);
      apex.debug.info("Meta", meta);
      var fields = meta.fields || {};
      apex.debug.info("Fields", fields);
      if (!fields[fieldName]) {
        fields[fieldName] = {};
      }
      fields[fieldName].highlight = _getHighlight(
        model.getValue(change.record, fieldName)
      );
      //view.refresh();
    } else if (type == "addData") {
      _initHighlights();
    }
  }

  function _initHighlights(regionId) {
    _regionId = regionId || _regionId;
    var myRegion = apex.region(_regionId);
    if (myRegion) {
      var myView = myRegion.call("getCurrentView");
      var model = myView.model;
      model.forEach(function (record, index, id) {
        var meta = model.getRecordMetadata(id);
        var fields = meta.fields;
        if (!fields[fieldName]) {
          fields[fieldName] = {};
        }
        fields[fieldName].highlight = _getHighlight(
          model.getValue(record, fieldName)
        );
      });
      myView.refresh();
    }
  }

  holyGrid.highlightColumn = holyGrid.highlightColumn || {};
  holyGrid.highlightColumn = {
    updateHighlight: _updateHighlight,
    initHighlights: _initHighlights,
  };
})(apex.region, apex.message, apex.lang);
