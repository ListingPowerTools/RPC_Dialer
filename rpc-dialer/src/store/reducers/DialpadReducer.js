const DialpadReducer = (
  state = { 
    token: '',
    device: null,
    tasks: [],
    reservations: [],
    worker: {
      sid: 'WK007',
      contact_uri: '',
      name: 'Morty'
    },
    ws_url: 'ws://localhost:8080/worker',
    ws: null,
    activeCall: {},
    acceptedTask: {},
    conferenceHold: false,
    activity: 'Available'
  }, 
  
  action
  
  ) => {
  
  switch (action.type) {
    case 'USER_LOGIN':
        console.log('USER LOGIN: ', action.identity)
        const _worker = Object.assign({}, state.worker)
        _worker.contact_uri = action.identity;

        return Object.assign({}, state, {
          worker: _worker
        })

    case 'SAVE_TOKEN':
      const tokenState = Object.assign({}, state)
      tokenState.token = action.token

      return Object.assign({}, state, tokenState)

    case 'SAVE_RESERVATION':
      const reservationState = [...state.reservations, action.reservation]

      console.log('the reservation in reducer: ', action.reservation)
      return Object.assign({}, state, {
        reservations: reservationState
      })

    case 'REMOVE_RESERVATION':
      let _reservationState = [...state.reservations]

      _reservationState = _reservationState.filter(r=> {
        console.log(r)
        return r.sourceObject.data.CallSid != action.reservation.data.CallSid
      })

      return Object.assign({}, state, {
        reservations: _reservationState
      })

    case 'ACCEPT_TASK':
      const callState = Object.assign({}, state)

      console.log('the task in reducer: ', action.task)
      return Object.assign({}, state, {
        activeCall: callState
      })

    case 'SET_ACTIVE_CALL':
      let activeCallState = Object.assign({}, state.activeCall)

      activeCallState = action.activeCall;
      console.log('the task in reducer: ', action.activeCall)
      return Object.assign({}, state, {
        activeCall: activeCallState
      })
    case 'SET_ACCEPTED_TASK':
      let acceptedTask = Object.assign({}, state.acceptedTask)

      acceptedTask = action.acceptedTask;
      console.log('the task in reducer: ', action.acceptedTask)
      return Object.assign({}, state, {
        acceptedTask: acceptedTask
      })

    case 'ADD_CONFERENCE_SID':
      let _activeCallState = Object.assign({}, state.acceptedTask)
      console.log('SET: ', _activeCallState)
      console.log('STATE: ', state.acceptedTask)

      _activeCallState.ConferenceSid = action.activeCall.ConferenceSid;
      _activeCallState.CallStatus = 'in-progress'
      console.log('the task in reducer: ', action.activeCall)
      console.log('new active call state with conference: ', _activeCallState)
      return Object.assign({}, state, {
        activeCall: _activeCallState
      })

    case 'SAVE_DEVICE':
      console.log('the device in reducer: ', action.device)
      let deviceState = Object.assign({}, state.device)
      deviceState = action.device;

      return Object.assign({}, state, {
        device: deviceState
      })

    case 'END_CALL':
      //For now the call ends immediately, but it should just 
      //transition into a "CALL_COMPLETE" state and maintain the active call window with "CALL COMPLETE PENDING"
      let empty = Object.assign({}, state.activeCall)
      empty = {}

      console.log('the call in reducer: ', action.call)
      return Object.assign({}, state, {
        activeCall: empty
      })

    case 'SAVE_WEBSOCKET':
      console.log('the websocket in reducer: ', action.websocket)

      const websocket = Object.assign({}, state)
      websocket.ws = action.websocket
      return Object.assign({}, state, {
        ws: websocket
      })

    case 'TOGGLE_HOLD_STATE':
      console.log('hold: ', action.hold)
      console.log('active call: ', state.activeCall)
      let toggle = Object.assign({}, state.activeCall)

      toggle.Hold = action.hold

      return Object.assign({}, state, {
        activeCall: toggle
      })

    /* falls through */
    default:
      return state
  }
}

export default DialpadReducer