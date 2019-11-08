const { ACCOUNT_SID, AUTH_TOKEN, WORKSPACE } = require('../../config');

//Twilio Modules
const taskrouter = require('twilio').jwt.taskrouter;
const util = taskrouter.util;

const TaskRouterCapability = taskrouter.TaskRouterCapability;
const Policy = TaskRouterCapability.Policy;

//The workerSid needs to be queried from a database or redis connection
const WORKER_SID = 'WKd2aed5ae3830d4cc0d381a07fb063477';

const TASKROUTER_BASE_URL = 'https://taskrouter.twilio.com';
const VERSION = 'v1';

module.exports = (req, res, next) => {
  console.log('workspace: ', WORKSPACE)
  try {
    const capability = new TaskRouterCapability({
      accountSid: ACCOUNT_SID,
      authToken: AUTH_TOKEN,
      workspaceSid: WORKSPACE,
      channelId: WORKER_SID
    });

    // Helper function to create Policy
    function buildWorkspacePolicy(options) {
      options = options || {};
      var resources = options.resources || [];
      var urlComponents = [TASKROUTER_BASE_URL, VERSION, 'Workspaces', WORKSPACE]

      return new Policy({
        url: urlComponents.concat(resources).join('/'),
        method: options.method || 'GET',
        allow: true
      });
    }

    // Event Bridge Policies
    var eventBridgePolicies = util.defaultEventBridgePolicies(ACCOUNT_SID, WORKER_SID);

    // Worker Policies
    var workerPolicies = util.defaultWorkerPolicies(VERSION, WORKSPACE, WORKER_SID);

    var workspacePolicies = [
      // Workspace fetch Policy
      buildWorkspacePolicy(),
      // Workspace subresources fetch Policy
      buildWorkspacePolicy({ resources: ['**'] }),
      // Workspace Activities Update Policy
      buildWorkspacePolicy({ resources: ['Activities'], method: 'POST' }),
      // Workspace Activities Worker Reserations Policy
      buildWorkspacePolicy({ resources: ['Workers', WORKER_SID, 'Reservations', '**'], method: 'POST' }),
    ];

    eventBridgePolicies.concat(workerPolicies).concat(workspacePolicies).forEach(function (policy) {
      capability.addPolicy(policy);
    });

    var token = capability.toJwt();
    req.taskrouter_token = token;
    next()
  } catch (e) {
    console.log(e)
    res.send({
      status: 500,
      message: 'Unable retrieve TR token'
    })
  }
}