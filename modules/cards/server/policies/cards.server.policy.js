'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Cards Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/cards',
      permissions: '*'
    }, {
      resources: '/api/cards/:cardId',
      permissions: '*'
    }, {
      resources: '/api/folder',
      permissions: '*'
    }, {
      resources: '/api/folder/:folderId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/cards',
      permissions: ['get']
    }, {
      resources: '/api/cards/:cardId',
      permissions: ['get']
    }, {
      resources: '/api/folder',
      permissions: '*'
    }, {
      resources: '/api/folder/:folderId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Cards Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an card is being processed and the current user created it then allow any manipulation
  if (req.card && req.user && req.card.user && req.card.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
