import React from "react";
import { SingleCommentContainer, SingleCommentCard, SingleCommentAuthor, SingleCommentTime, EditOrDeleteContainer, EditButton, } from './CommentSection.styled'
import CommentButton from "./CommentButtons"


function Comments({ handleEdit, comments, handleDelete }) {


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


                            <EditOrDeleteContainer>
                                <CommentButton handleAction={handleDelete} commentId={comment?.id} />
                                <CommentButton targetEdit={comment?.content} handleAction={handleEdit} author={comment?.author} commentId={comment?.id} />
                            </EditOrDeleteContainer>



                        </SingleCommentCard>
                    )
                })}
            </ul>
        </SingleCommentContainer>
    )
}
export default Comments



