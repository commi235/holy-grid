/*
Put this into "JavaScript Initialization Attributes" on the calculated column.
*/
function( options ) {
  // Always use apex.debug instead of console.*
  // This integrates nicely with APEX Debug Settings for the current session
  apex.debug.info("Intitial Options", options);

  // Add dependsOn and calValue
  // dependsOn works similar to cascading LOV definition
  // calValue is the function that gets called whenever a field in dependsOn changes
  options.defaultGridColumnOptions = {
    dependsOn: ["SAL", "COMM"],
    calcValue: function( argsArray, model, record ) {
      apex.debug.info("argsArray", argsArray);
      return (argsArray[0] || 0) + (argsArray[1] || 0);
    }
  };

  apex.debug.info("New Options", options);
  return options;
}
