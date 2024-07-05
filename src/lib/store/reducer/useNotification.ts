import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      state.notifications = action.payload;
    },
    clearNotification(state) {
      state.notifications = [];
    },
    addNotification(state, action) {
      state.notifications.push(action.payload);
      //state.dataDB = [...state.dataDB , action.payload]
    },
    setReadAllNotification(state) {
      const updatedNotif = state.notifications.map(item => ({
        ...item,
        status: "SEEN"
      }));
      state.notifications = updatedNotif;
      //state.dataDB = [...state.dataDB , action.payload]
    },
  },
});

export const { setNotification, clearNotification , addNotification , setReadAllNotification} = notificationSlice.actions;

export default notificationSlice.reducer;
