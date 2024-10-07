import { createSlice } from "@reduxjs/toolkit";
import {
  fetchModules,
  addModule,
  editModule,
  deleteModule,
  moveModule,
} from "./moduleThunk";
import { addChapter, editChapter, deleteChapter } from "./chapterThunk"; // Chapter operations
import { addAttachment, deleteAttachmentThunk } from "./attachmentThunk"; // Attachment operations

const initialState = {
  modules: [],
  selectedModule: null,
  moduleLoading: false,
  chapterLoading: false,
  attachmentLoading: false,
  error: null,
};

const moduleSlice = createSlice({
  name: "module",
  initialState,
  reducers: {
    setSelectedModule: (state, action) => {
      state.selectedModule = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Module Operations
    builder
      .addCase(fetchModules.pending, (state) => {
        state.moduleLoading = true;
        state.error = null;
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.moduleLoading = false;
        state.modules = action.payload;
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.moduleLoading = false;
        state.error = action.payload;
      })
      .addCase(addModule.pending, (state) => {
        state.moduleLoading = true;
        state.error = null;
      })
      .addCase(addModule.fulfilled, (state, action) => {
        state.moduleLoading = false;
        // state.modules.push(action.payload);
      })
      .addCase(addModule.rejected, (state, action) => {
        state.moduleLoading = false;
        state.error = action.payload;
      })

      .addCase(moveModule.pending, (state) => {
        state.moduleLoading = true;
        state.error = null;
      })
      .addCase(moveModule.fulfilled, (state, action) => {
        state.moduleLoading = false;
      })
      .addCase(moveModule.rejected, (state, action) => {
        state.moduleLoading = false;
        state.error = action.payload;
      })

      .addCase(editModule.pending, (state) => {
        state.moduleLoading = true;
        state.error = null;
      })
      .addCase(editModule.fulfilled, (state, action) => {
        state.moduleLoading = false;
        // const index = state.modules.findIndex(
        //   (module) => module._id === action.payload._id
        // );
        // if (index !== -1) {
        //   state.modules[index] = action.payload;
        // }
      })
      .addCase(editModule.rejected, (state, action) => {
        state.moduleLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteModule.pending, (state) => {
        state.moduleLoading = true;
        state.error = null;
      })
      .addCase(deleteModule.fulfilled, (state, action) => {
        state.moduleLoading = false;
        state.modules = state.modules.filter(
          (module) => module._id !== action.payload
        );
      })
      .addCase(deleteModule.rejected, (state, action) => {
        state.moduleLoading = false;
        state.error = action.payload;
      });

    // Chapter Operations
    builder
      .addCase(addChapter.pending, (state) => {
        state.chapterLoading = true;
        state.error = null;
      })
      .addCase(addChapter.fulfilled, (state) => {
        state.chapterLoading = false;
      })
      .addCase(addChapter.rejected, (state, action) => {
        state.chapterLoading = false;
        state.error = action.payload;
      })
      .addCase(editChapter.pending, (state) => {
        state.chapterLoading = true;
        state.error = null;
      })
      .addCase(editChapter.fulfilled, (state) => {
        state.chapterLoading = false;
      })
      .addCase(editChapter.rejected, (state, action) => {
        state.chapterLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteChapter.pending, (state) => {
        state.chapterLoading = true;
        state.error = null;
      })
      .addCase(deleteChapter.fulfilled, (state) => {
        state.chapterLoading = false;
      })
      .addCase(deleteChapter.rejected, (state, action) => {
        state.chapterLoading = false;
        state.error = action.payload;
      });

    // Attachment Operations
    builder
      .addCase(addAttachment.pending, (state) => {
        state.attachmentLoading = true;
        state.error = null;
      })
      .addCase(addAttachment.fulfilled, (state) => {
        state.attachmentLoading = false;
      })
      .addCase(addAttachment.rejected, (state, action) => {
        state.attachmentLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteAttachmentThunk.pending, (state) => {
        state.attachmentLoading = true;
        state.error = null;
      })
      .addCase(deleteAttachmentThunk.fulfilled, (state) => {
        state.attachmentLoading = false;
      })
      .addCase(deleteAttachmentThunk.rejected, (state, action) => {
        state.attachmentLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedModule } = moduleSlice.actions;
export default moduleSlice.reducer;
