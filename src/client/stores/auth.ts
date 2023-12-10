import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";

import { RootState } from "./store";

import { authApi } from "@apis/auth";
import { initAuthToken, setAuthToken } from "@apis/authToken";
import { SignInRequestBody } from "@shared/auth";

const SLICE_NAME = "auth";

export type ObjectState = "undefined" | "loading" | "ready" | "error";

interface AuthState {
  isLogged: boolean;
  state: ObjectState;
  error: string;
}

const initialState: AuthState = {
  isLogged: false,
  state: "undefined",
  error: "",
};

export const initAuth = createAsyncThunk(
  `${SLICE_NAME}/initAuth`,
  async (_, { dispatch, getState }) => {
    const { auth } = getState() as RootState;
    if (auth.state === "undefined") {
      const sessionId = initAuthToken();
      dispatch(sessionId ? checkSession() : setState("ready"));
    }
  }
);

export const checkSession = createAsyncThunk(
  `${SLICE_NAME}/checkSession`,
  async () => {
    return await authApi.checkSession();
  }
);

export const signIn = createAsyncThunk(
  `${SLICE_NAME}/signIn`,
  async (body: SignInRequestBody) => {
    return await authApi.signIn(body);
  }
);

export const signOut = createAsyncThunk(`${SLICE_NAME}/signOut`, async () => {
  return await authApi.signOut();
});

export const authSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setIsLogged: (state, action: PayloadAction<boolean>) => {
      state.isLogged = action.payload;
    },
    setState: (state, action: PayloadAction<ObjectState>) => {
      state.state = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkSession.pending, (state) => {
      state.isLogged = false;
      state.state = "loading";
      state.error = "";
    });
    builder.addCase(checkSession.rejected, (state) => {
      state.isLogged = false;
      setAuthToken("");
      state.state = "ready";
    });
    builder.addCase(checkSession.fulfilled, (state, action) => {
      const { status } = action.payload;
      state.isLogged = status === "ok";
      if (!state.isLogged) {
        setAuthToken("");
      }
      state.state = "ready";
    });
    builder.addCase(signIn.pending, (state) => {
      state.isLogged = false;
      state.state = "loading";
      state.error = "";
    });
    builder.addCase(signIn.rejected, (state) => {
      setAuthToken("");
      state.state = "error";
      state.isLogged = false;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.state = "ready";
      setAuthToken(action.payload.sessionId);
      state.isLogged = true;
    });
    builder.addCase(signOut.pending, (state) => {
      state.state = "loading";
    });
    builder.addCase(signOut.rejected, (state) => {
      state.state = "ready";
    });
    builder.addCase(signOut.fulfilled, (state) => {
      setAuthToken("");
      state.isLogged = false;
      state.state = "ready";
    });
  },
});

export const { setState, setError } = authSlice.actions;

const selectState = (state: RootState) => state.auth;
export const selectAuthState = createSelector(
  selectState,
  (state) => state.state
);
export const selectError = createSelector(selectState, (state) => state.error);
export const selectIsLogged = createSelector(
  selectState,
  (state) => state.isLogged
);
