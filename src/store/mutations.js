export function addUserDataInState(state, data) {
  state.userData = data;
  console.log(state.userData);
}

export function logoutCurrentUser(state) {
    state.userData = [];
    console.log(state.userData)
}