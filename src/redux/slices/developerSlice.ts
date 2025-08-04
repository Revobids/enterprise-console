import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApiManager } from '../../api/ApiManager';
import { RealEstateDeveloper, CreateDeveloperDto } from '../../types/api';

// Developer state interface
interface DeveloperState {
  developers: RealEstateDeveloper[];
  selectedDeveloper: RealEstateDeveloper | null;
  isLoading: boolean;
  error: string | null;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
}

// Initial state
const initialState: DeveloperState = {
  developers: [],
  selectedDeveloper: null,
  isLoading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

// Async thunks for developer operations
export const fetchDevelopers = createAsyncThunk(
  'developer/fetchDevelopers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiManager.getAllDevelopers();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch developers');
    }
  }
);

export const fetchDeveloperById = createAsyncThunk(
  'developer/fetchDeveloperById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await ApiManager.getDeveloperById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch developer');
    }
  }
);

export const createDeveloper = createAsyncThunk(
  'developer/createDeveloper',
  async (developerData: CreateDeveloperDto, { rejectWithValue }) => {
    try {
      const response = await ApiManager.createDeveloper(developerData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create developer');
    }
  }
);

export const updateDeveloper = createAsyncThunk(
  'developer/updateDeveloper',
  async ({ id, data }: { id: string; data: Partial<CreateDeveloperDto> }, { rejectWithValue }) => {
    try {
      const response = await ApiManager.updateDeveloper(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update developer');
    }
  }
);

export const deleteDeveloper = createAsyncThunk(
  'developer/deleteDeveloper',
  async (id: string, { rejectWithValue }) => {
    try {
      await ApiManager.deleteDeveloper(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete developer');
    }
  }
);

// Developer slice
const developerSlice = createSlice({
  name: 'developer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedDeveloper: (state, action: PayloadAction<RealEstateDeveloper | null>) => {
      state.selectedDeveloper = action.payload;
    },
    clearSelectedDeveloper: (state) => {
      state.selectedDeveloper = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Developers
      .addCase(fetchDevelopers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDevelopers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.developers = action.payload;
        state.error = null;
      })
      .addCase(fetchDevelopers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Developer by ID
      .addCase(fetchDeveloperById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDeveloperById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedDeveloper = action.payload;
        state.error = null;
      })
      .addCase(fetchDeveloperById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Developer
      .addCase(createDeveloper.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createDeveloper.fulfilled, (state, action) => {
        state.createLoading = false;
        state.developers.push(action.payload);
        state.error = null;
      })
      .addCase(createDeveloper.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload as string;
      })
      // Update Developer
      .addCase(updateDeveloper.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateDeveloper.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.developers.findIndex(dev => dev.id === action.payload.id);
        if (index !== -1) {
          state.developers[index] = action.payload;
        }
        if (state.selectedDeveloper?.id === action.payload.id) {
          state.selectedDeveloper = action.payload;
        }
        state.error = null;
      })
      .addCase(updateDeveloper.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      })
      // Delete Developer
      .addCase(deleteDeveloper.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteDeveloper.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.developers = state.developers.filter(dev => dev.id !== action.payload);
        if (state.selectedDeveloper?.id === action.payload) {
          state.selectedDeveloper = null;
        }
        state.error = null;
      })
      .addCase(deleteDeveloper.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setSelectedDeveloper,
  clearSelectedDeveloper,
} = developerSlice.actions;

export default developerSlice.reducer;