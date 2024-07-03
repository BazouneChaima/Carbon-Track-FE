import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import companyReducer from './reducer/useCompany';
import emissionReducer from './reducer/useEmission';
import fileReducer from './reducer/useFile';
import globalActionsReducer from './reducer/useGlobalActions';
import notificationReducer from './reducer/useNotification';
import notificationSettingsReducer from './reducer/useNotificationSettings';
import roleReducer from './reducer/useRole';
import userReducer from './reducer/userSlice';
import targetReducer from './reducer/useTarget';
import taskReducer from './reducer/useTask';
import usersReducer from './reducer/useUser';

const persistConfig = {
  key: 'root',
  storage,
};

const prUser = persistReducer(persistConfig, userReducer);
const prCompany = persistReducer(persistConfig, companyReducer);

const rootReducer = combineReducers({
  user: prUser,
  target: targetReducer,
  task: taskReducer,
  users: usersReducer,
  company: prCompany,
  emission: emissionReducer,
  role: roleReducer,
  file: fileReducer,
  globalActions: globalActionsReducer,
  notification: notificationReducer,
  notificationSettings: notificationSettingsReducer,
});

// Configure the store with the combined reducer
const store = configureStore({
  reducer: rootReducer,
});
// const store = configureStore({
//   reducer: {
//     user: persistedReducer,

//   },
// });

export const persistor = persistStore(store);
export default store;
