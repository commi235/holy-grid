/* global apex */

var holyGrid = holyGrid || {};

(function ($) {
  const commFieldName = "COMM";
  const salFieldName = "SAL";
  /**
   * Function gets a change information from the Grid
   * Checks if commission is within certain bounderies and returns validation result
   * @param {*} model Reference to the model with send the notification
   * @param {*} change Object with information about the change
   */
  function _checkCommission(model, change) {
    // prepare a return object
    // easier to assign additional attributes later
    var returnObject = {
      fieldName: commFieldName,
      recordId: change.recordId,
    };

    //
    // Use getFieldKey to get array postion in record.
    // Then access the record array directly.
    /*
    const commFieldKey = model.getFieldKey(commFieldName);
    const salFieldKey = model.getFieldKey(salFieldName);
    const newCommission = parseInt(change.record[commFieldKey]);
    const currentSalary = parseInt(change.record[salFieldKey]);
    */

    // Preferred alternative is using model.getValue function
    const newCommission = model.getValue(change.record, commFieldName);
    const currentSalary = model.getValue(change.record, salFieldName);
    // previous value of field
    const oldCommission = change.oldValue;

    if (change.oldValue == "") {
      // if there is no old commisiion compare against salary
      //var currentSalary = parseInt(change.record[salFieldKey]);
      const commToSalPct = newCommission / currentSalary;
      if (commToSalPct > 0.1) {
        returnObject.result = "error";
        returnObject.message =
          "A new commission can't be more that 10% of the salary";
      } else {
        returnObject.result = "valid";
      }
    } else {
      // Otherwise compare to previous commission
      // This will only be a warning
      const pctDiff = (newCommission - oldCommission) / oldCommission;
      if (pctDiff > 0.1) {
        returnObject.result = "warning";
        returnObject.message =
          "The new commission is more than 10% above the previous";
      } else {
        returnObject.result = "valid";
      }
    }
    return returnObject;
  }

  function _validateCommission(model, view, type, change) {
    apex.debug.info("_validateCommission Start", model, type, change);
    // We are only interested in changes of type "set" and for the commission field
    if (type == "set" && change.field == commFieldName) {
      const validationResult = _checkCommission(model, change);
      apex.debug.info("Validation Result", validationResult);
      setTimeout(function () {
        model.setValidity(
          validationResult.result,
          change.recordId,
          validationResult.fieldName,
          validationResult.message
        );
      }, 200);
    }
  }

  holyGrid.validation = holyGrid.validation || {};
  holyGrid.validation.validateCommision = _validateCommission;
})(apex.jQuery);
