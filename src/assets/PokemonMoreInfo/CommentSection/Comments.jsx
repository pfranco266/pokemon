import React from "react";
import { SingleCommentContainer, SingleCommentCard,  SingleCommentAuthor, SingleCommentTime, EditOrDeleteContainer, EditButton,  } from './CommentSection.styled'
import CommentButton from "./CommentButtons"


function Comments({ comments, handleDelete }) {


    console.log(comments)

    return (
        <SingleCommentContainer>
            COMMENTS: 
            <ul>
                {comments?.length > 0 && comments?.map((comment, index) => {
                    return (
                        <SingleCommentCard key={comment?.id}>
                            <SingleCommentAuthor>{comment?.author}<SingleCommentTime> (says) </SingleCommentTime> * <SingleCommentTime>{comment.createdAt}</SingleCommentTime></SingleCommentAuthor>
                            <li > {comment?.content}</li>
                           

                                {/* <EditButton>Edit Comment</EditButton> */}

                                <CommentButton handleDelete={handleDelete} commentId={comment?.id} />
                              
                        </SingleCommentCard>
                    )
                })}
            </ul>
        </SingleCommentContainer>
    )
}
export default Comments



