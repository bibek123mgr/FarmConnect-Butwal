import { createSlice } from "@reduxjs/toolkit";
import { createComment, deleteComment, getAllComments, updateComment } from "./CommentApi";

export interface IComment {
    id: number;
    comment: string;
    rating: number;
    createdAt: string;
    createdBy: string;
    createdByName: string;
}

const initialState = {
    comments: [] as IComment[],
    loading: false,
    success: false,
    error: false,
    message: "",
}

const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        clearMessage: (state) => {
            state.message = "";
            state.error = false;
            state.success = false;
        },
        deleteCommentFromState: (state, action) => {
            state.comments = state.comments.filter((comment) => comment.id !== action.payload);
        },
        updateCommentFromState: (state, action) => {
            state.comments = state.comments.map((comment) => {
                if (comment.id === action.payload.id) {
                    return {
                        ...comment,
                        comment: action.payload.comment,
                        rating: action.payload.rating
                    }
                }
                return comment;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllComments.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(getAllComments.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.comments = action.payload.data;
            })
            .addCase(getAllComments.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
            .addCase(createComment.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(createComment.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
            .addCase(deleteComment.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
               
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
            .addCase(updateComment.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(updateComment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(updateComment.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
    },
});

export const { clearMessage, deleteCommentFromState, updateCommentFromState } = commentSlice.actions;
export default commentSlice.reducer;