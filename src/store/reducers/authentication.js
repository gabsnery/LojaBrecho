const INITIAL_STATE = {
  authentication: []
}

export default function reducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        authentication: action.authentication
      }
    default:
  }
  return state
}
