import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Room } from '../../types';
import { roomService } from '../../services/rooms';

interface RoomState {
  activeRoom: Room | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: RoomState = {
  activeRoom: null,
  status: 'idle',
};

export const fetchActiveRoom = createAsyncThunk('room/fetchActive', async (userId: string) => {
  return await roomService.getActiveRoomForUser(userId);
});

export const createRoom = createAsyncThunk('room/create', async (input: any) => {
  return await roomService.createRoom(input);
});

export const joinRoom = createAsyncThunk('room/join', async ({ userId, username, inviteCode }: any) => {
  return await roomService.joinRoom(userId, username, inviteCode);
});

export const leaveRoom = createAsyncThunk('room/leave', async ({ userId, roomId }: any) => {
  await roomService.leaveRoom(userId, roomId);
});

export const endRoom = createAsyncThunk('room/end', async ({ roomId, hostId }: any) => {
  await roomService.endRoom(roomId, hostId);
});

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    clearActiveRoom: (state) => {
      state.activeRoom = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveRoom.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchActiveRoom.fulfilled, (state, action) => {
        state.status = 'idle';
        state.activeRoom = action.payload;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.activeRoom = action.payload;
      })
      .addCase(joinRoom.fulfilled, (state, action) => {
        state.activeRoom = action.payload;
      })
      .addCase(leaveRoom.fulfilled, (state) => {
        state.activeRoom = null;
      })
      .addCase(endRoom.fulfilled, (state) => {
        state.activeRoom = null;
      });
  },
});

export const { clearActiveRoom } = roomSlice.actions;
export default roomSlice.reducer;
