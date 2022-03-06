import { ReduxType } from './../../constants/ReduxTypeConstants';

const commonReducer = (state = {} as any, action: any) => {
	switch (action.type) {
		case ReduxType.SS_CHANGE:
			const data = !!state.isSSChange;
			return Object.assign({}, state, { isSSChange: !data });
	}
	return state;
};

export default commonReducer;
