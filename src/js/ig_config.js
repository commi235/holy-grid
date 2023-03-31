/* global apex */

var holyGrid = holyGrid || {};

(function ($) {
  const defaultSettings = {
    buttons: {
      delete: {
        class: "hg-add-delete-btn",
        controlGroup: "actions2",
        data: {
          type: "BUTTON",
          action: "selection-delete",
          iconBeforeLabel: true,
        },
      },
      filter: {
        class: "hg-add-filter-btn",
        controlGroup: "actions2",
        data: {
          type: "BUTTON",
          action: "show-filter-dialog",
          iconBeforeLabel: true,
        },
      },
    },
  };

  function _apply(options) {
    apex.debug.info("Original options", options);
    // Try to get toolbar, if undef use default
    let toolbarData =
      options.toolbarData || $.apex.interactiveGrid.copyDefaultToolbar();
    // The config object contains the static region id, so we can use that to target the iGrid
    let myRegion = $("#" + options.regionStaticId);
    let controlGroups = {};
    for (const buttonKey in defaultSettings.buttons) {
      const buttonConfig = defaultSettings.buttons[buttonKey];
      apex.debug.info("Check for Button", buttonKey, buttonConfig);

      if (myRegion.hasClass(buttonConfig.class)) {
        apex.debug.info("Found class, include button", buttonKey);
        if (!controlGroups[buttonConfig.controlGroup]) {
          apex.debug.info(
            "Pulling new ToolbarGroup ",
            buttonConfig.controlGroup
          );
          controlGroups[buttonConfig.controlGroup] = toolbarData.toolbarFind(
            buttonConfig.controlGroup
          ).controls;
        }

        controlGroups[buttonConfig.controlGroup].push(buttonConfig.data);
      } else {
        apex.debug.info("Do not include button", buttonKey);
      }
    }

    options.toolbarData = toolbarData;
    apex.debug.info("Modified options", options);
    return options;
  }
  holyGrid.config = holyGrid.config || {};
  holyGrid.config.apply = _apply;
})(apex.jQuery);
