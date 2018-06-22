(function (window) {
  'use strict';

  var applicationModuleName = 'mean';

  var service = {
    applicationEnvironment: window.env,
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router',
      'ui.bootstrap', 'ngFileUpload', 'ui-notification', 'ngDialog', 'LocalStorageModule', 'checklist-model'],
    registerModule: registerModule
  };

  window.ApplicationConfiguration = service;

  // Add a new vertical module
  function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  }

  // Angular-ui-notification configuration
  angular.module('ui-notification').config(function (NotificationProvider) {
    NotificationProvider.setOptions({
      delay: 2000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'bottom'
    });
  });

  var underscore = angular.module('underscore', []);
  underscore.factory('_', function () {
    return window._;
    // Underscore should be loaded on the page
  });

  angular.module('LocalStorageModule').config(function (localStorageServiceProvider) {
      localStorageServiceProvider
      .setPrefix('flashcard')
      .setDefaultToCookie(true)
      .setNotify(true, true);
  });

}(window));
