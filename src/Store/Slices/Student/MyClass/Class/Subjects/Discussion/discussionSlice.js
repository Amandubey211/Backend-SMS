import { createSlice } from "@reduxjs/toolkit"
import { createStudentDiscussionComment, createStudentDiscussionReply, editStudentDiscussionComment, editStudentDiscussionReply, fetchStudentCommentsByDiscussion, fetchStudentDiscussion, fetchStudentDiscussionById, markAsReadStudentDiscussion, updateStudentPinStatus } from "./discussion.action";


const initialState = {
    discussionData: [],
    discussion: null,
    isSidebarOpen: false,
    loading: false,
    error: null,
    comments: [],
    loadingComments: false,
    errorComments: null,
}

const discussionSlice = createSlice({
    name: "student/discussionSlice",
    initialState,
    reducers: {
        setSidebarOpen: (state, action) => {
            state.isSidebarOpen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudentDiscussion.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchStudentDiscussion.fulfilled, (state, action) => {
                state.loading = false;
                state.discussionData = action.payload;
            })
            .addCase(fetchStudentDiscussion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        builder
            .addCase(updateStudentPinStatus.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updateStudentPinStatus.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateStudentPinStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        builder
            .addCase(markAsReadStudentDiscussion.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(markAsReadStudentDiscussion.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(markAsReadStudentDiscussion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        builder
            .addCase(fetchStudentDiscussionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentDiscussionById.fulfilled, (state, action) => {
                state.loading = false;
                state.discussion = action.payload;
            })
            .addCase(fetchStudentDiscussionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });


        builder
            .addCase(fetchStudentCommentsByDiscussion.pending, (state) => {
                state.loadingComments = true;
                state.errorComments = null;
                //state.comments = null;
            })
            .addCase(fetchStudentCommentsByDiscussion.fulfilled, (state, action) => {
                state.loadingComments = false;
                state.comments = action.payload;
            })
            .addCase(fetchStudentCommentsByDiscussion.rejected, (state, action) => {
                state.loadingComments = false;
                state.errorComments = action.payload;
            });

        builder
            .addCase(createStudentDiscussionComment.pending, (state) => {
                state.loadingComments = true;
                state.errorComments = null;
            })
            .addCase(createStudentDiscussionComment.fulfilled, (state, action) => {
                state.loadingComments = false;
                state.comments.push(action.payload);
            })
            .addCase(createStudentDiscussionComment.rejected, (state, action) => {
                state.loadingComments = false;
                state.errorComments = action.payload;
            });

        builder
            .addCase(editStudentDiscussionComment.fulfilled, (state, action) => {
                const index = state.comments.findIndex(
                    (comment) => comment._id === action.payload._id
                );
                if (index !== -1) {
                    state.comments[index] = action.payload; // Update comment
                }
            });

        builder
            .addCase(editStudentDiscussionReply.fulfilled, (state, action) => {
                const index = state.comments.findIndex(
                    (comment) => comment._id === action.payload._id
                );
                if (index !== -1) {
                    state.comments[index] = action.payload; // Update comment
                }
            });

        builder
            .addCase(createStudentDiscussionReply.fulfilled, (state, action) => {
                const { parentId } = action.payload;

                // Find the parent comment or reply where this reply should go
                const parentCommentOrReply = findCommentOrReply(state.comments, parentId);

                if (parentCommentOrReply) {
                    parentCommentOrReply.replies.push(action.payload);
                }
            });
    }
})

const findCommentOrReply = (comments, parentId) => {
    for (let comment of comments) {
        if (comment._id === parentId) {
            return comment;
        }
        if (comment.replies && comment.replies.length > 0) {
            const foundReply = findCommentOrReply(comment.replies, parentId);
            if (foundReply) return foundReply;
        }
    }
    return null;
};

export const { setSidebarOpen } = discussionSlice.actions;
export default discussionSlice.reducer;