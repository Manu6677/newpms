export function addUserDataInState(state, {data, uid}) {
  state.userData = {data, uid};
  console.log(state.userData);
}

export function logoutCurrentUser(state) {
    state.userData = [];
    console.log(state.userData)
}