import { createAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '@redux/store';

export const hydrate = createAction<AppState>(HYDRATE);
