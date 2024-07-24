const initialComments = {

    commentsList: [],
}





function commentReducer (state, action) {
    switch (action.type) {
        case 'fetchComments':
        return  {
                ...state,
                commentsList: action.payload
            };
        case 'submitComment':

           return {
                ...state,
                commentsList: [...state.commentsList, action.payload]
            } || null;
        case 'editComment':
            // find, filter the comments
            const updatedCommentsList = state.commentsList.filter(comment => comment.id !== action.payload.id);
            return {
                ...state,
                commentsList: [...updatedCommentsList, action.payload]
            };
       
        case 'deleteComment':
        

        const updatedCommentList = state?.commentsList?.filter(comment => {
            return comment.id !== action.payload; // Ensure you compare the ID
        });
            
            return {
                 ...state,
                 commentsList: updatedCommentList
            };    
        case 'default':
        return {
                ...state,
         };

    }
}


export {commentReducer, initialComments}