export const CHANGE_USERS_LISTS = "CHANGE_USERS_LISTS";

export const changeUserLists = (usersLists) => ({
  type: CHANGE_USERS_LISTS,
  payload: usersLists,
});
