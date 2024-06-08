import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './reducer/userSlice';
import targetReducer from './reducer/useTarget';
import  taskReducer from './reducer/useTask';
<<<<<<< HEAD
import usersReducer from './reducer/useUser';;
import fileReducer from './reducer/useFile'
import companyReducer from './reducer/useCompany';
import emissionReducer from './reducer/useEmission';
import roleReducer from './reducer/useRole';
import globalActionsReducer from './reducer/useGlobalActions'
=======
import usersReducer from './reducer/useUser';
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);



const rootReducer = combineReducers({
  user: persistedReducer,
  target: targetReducer,
  task: taskReducer,
  users:usersReducer,
<<<<<<< HEAD
  company:companyReducer,
  emission:emissionReducer,
  role:roleReducer,
  file: fileReducer,
  globalActions: globalActionsReducer,
  file: fileReducer
=======
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
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