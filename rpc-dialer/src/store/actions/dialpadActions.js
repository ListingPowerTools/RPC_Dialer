export const saveWorker = (identity) => ({
  type: 'SAVE_WORKER',
  identity
})

export const saveDevice = (device) => ({
  type: 'SAVE_DEVICE',
  device
})

export const saveReservation = (reservation) => ({
  type: 'SAVE_RESERVATION',
  reservation
})

export const removeReservation = (reservation) => ({
  type: 'REMOVE_RESERVATION',
  reservation
})

export const saveToken = (token) => ({
  type: 'SAVE_TOKEN',
  token
})

//acceptTask will have to be modified to only send an event message
//to the backend and not manipulate activeCall property in state
export const acceptTask = (task) => ({
  type: 'ACCEPT_TASK',
  task
})

export const setActiveCall = (activeCall) => ({
  type: 'SET_ACTIVE_CALL',
  activeCall
})

export const setAcceptedTask = (acceptedTask) => ({
  type: 'SET_ACCEPTED_TASK',
  acceptedTask
})

export const addConferenceSid = (activeCall) => ({
  type: 'ADD_CONFERENCE_SID',
  activeCall
})

export const toggleHoldState = (hold) => ({
  type: 'TOGGLE_HOLD_STATE',
  hold
})

export const endCall = (call) => ({
  type: 'END_CALL',
  call
})

export const saveWebsocket = (websocket) => ({
  type: 'SAVE_WEBSOCKET',
  websocket
})