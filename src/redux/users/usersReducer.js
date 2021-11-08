import { CHANGE_USERS_LISTS } from "./usersActions";

const initialState = {
	users: [],
};

const usersReducer = (state = initialState, action) => {
	switch (action.type) {
		case CHANGE_USERS_LISTS:
	
			return {
				...state,
				users:action.payload
			};

		default:
			return state;
	}
};

export default usersReducer;