import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Challenge } from '../../types';
import { challengeService, CreateChallengeInput } from '../../services/challenges';

interface ChallengeState {
  activeChallenge: Challenge | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: ChallengeState = {
  activeChallenge: null,
  status: 'idle',
  error: null,
};

export const createChallenge = createAsyncThunk(
  'challenge/create',
  async (input: CreateChallengeInput) => {
    return await challengeService.createChallenge(input);
  }
);

export const joinChallenge = createAsyncThunk(
  'challenge/join',
  async ({ userId, inviteCode }: { userId: string, inviteCode: string }) => {
    return await challengeService.joinChallenge(userId, inviteCode);
  }
);

export const getChallenge = createAsyncThunk(
  'challenge/get',
  async (id: string) => {
    const c = await challengeService.getChallenge(id);
    if (!c) throw new Error("Not found");
    return c;
  }
);

export const setPlayerReady = createAsyncThunk(
  'challenge/setReady',
  async ({ challengeId, userId, ready }: { challengeId: string, userId: string, ready: boolean }) => {
    return await challengeService.setPlayerReady(challengeId, userId, ready);
  }
);

export const updatePlayerStatus = createAsyncThunk(
  'challenge/updateStatus',
  async ({ challengeId, userId, status, execTime, subTime }: { challengeId: string, userId: string, status: "Working" | "Solved", execTime?: number, subTime?: number }) => {
    return await challengeService.updatePlayerStatus(challengeId, userId, status, execTime, subTime);
  }
);

export const fetchActiveChallenge = createAsyncThunk(
  'challenge/fetchActive',
  async (userId: string) => {
    return await challengeService.getActiveChallenge(userId);
  }
);

export const pingChallengeConnection = createAsyncThunk(
  'challenge/ping',
  async ({ challengeId, userId }: { challengeId: string, userId: string }) => {
    return await challengeService.pingConnection(challengeId, userId);
  }
);

export const forfeitChallenge = createAsyncThunk(
  'challenge/forfeit',
  async ({ challengeId, userId }: { challengeId: string, userId: string }) => {
    return await challengeService.forfeitChallenge(challengeId, userId);
  }
);

const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    clearActiveChallenge: (state) => {
      state.activeChallenge = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createChallenge.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createChallenge.fulfilled, (state, action) => {
        state.status = 'idle';
        state.activeChallenge = action.payload;
      })
      .addCase(createChallenge.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed';
      })
      .addCase(joinChallenge.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(joinChallenge.fulfilled, (state, action) => {
        state.status = 'idle';
        state.activeChallenge = action.payload;
      })
      .addCase(joinChallenge.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed';
      })
      .addCase(getChallenge.fulfilled, (state, action) => {
        state.activeChallenge = action.payload;
      })
      .addCase(setPlayerReady.fulfilled, (state, action) => {
        state.activeChallenge = action.payload;
      })
      .addCase(updatePlayerStatus.fulfilled, (state, action) => {
        state.activeChallenge = action.payload;
      })
      .addCase(fetchActiveChallenge.fulfilled, (state, action) => {
        state.activeChallenge = action.payload;
      })
      .addCase(pingChallengeConnection.fulfilled, (state, action) => {
        state.activeChallenge = action.payload;
      })
      .addCase(forfeitChallenge.fulfilled, (state, action) => {
        state.activeChallenge = action.payload;
      });
  },
});

export const { clearActiveChallenge } = challengeSlice.actions;
export default challengeSlice.reducer;
