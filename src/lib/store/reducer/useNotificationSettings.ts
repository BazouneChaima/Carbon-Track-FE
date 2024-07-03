import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notificationSettings: null,
};

const notificationSettingsSlice = createSlice({
  name: 'notificationSettings',
  initialState,
  reducers: {
    setNotificationSettings(state, action) {
      state.notificationSettings = action.payload;
    },
    clearNotificationSettings(state) {
      state.notificationSettings = null;
    },
    addNotificationSettings(state, action) {
      state.notificationSettings = action.payload;
      //state.dataDB = [...state.dataDB , action.payload]
    },
  },
});

export const { setNotificationSettings, clearNotificationSettings , addNotificationSettings} = notificationSettingsSlice.actions;

export default notificationSettingsSlice.reducer;
