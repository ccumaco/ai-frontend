import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../../types';
import { apiService } from '../../services/apiService';
import type { RootState } from '../../store';

interface ProjectsState {
  data: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  data: [],
  loading: false,
  error: null,
};

// ✅ Thunk para crear proyectos
export const createProject = createAsyncThunk<
  Project, // tipo de retorno
  { name: string }, // argumento
  { rejectValue: string } // en caso de error
>('projects/createProject', async ({ name }, { rejectWithValue }) => {
  try {
    const response = await apiService.createProject({ name });
    if (response.success) {
      return response.data as Project;
    }
    return rejectWithValue('Failed to create project');
  } catch (error: any) {
    if (error?.response?.data?.error) {
      return rejectWithValue(error.response.data.error);
    }
    return rejectWithValue(error.message || 'Unexpected error');
  }
});

// ✅ Thunk para traer proyectos
export const fetchProjects = createAsyncThunk<Project[]>(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.listProjects();
      if (response.success) {
        return response.data as Project[];
      }
      return rejectWithValue('Failed to fetch projects');
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unexpected error');
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProjects: (state) => {
      state.data = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<Project[]>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProjects } = projectsSlice.actions;

// ✅ Selectores recomendados
export const selectProjects = (state: RootState) => state.projects.data;
export const selectProjectsLoading = (state: RootState) =>
  state.projects.loading;
export const selectProjectsError = (state: RootState) => state.projects.error;

export default projectsSlice.reducer;
