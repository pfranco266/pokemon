import React from "react";
import { SingleCommentContainer, SingleCommentCard, SingleCommentAuthor, SingleCommentTime, EditOrDeleteContainer, EditButton, } from './CommentSection.styled'
import CommentButton from "./CommentButtons"



  
  // Example usage

function Comments({ handleEdit, comments, handleDelete }) {



    function formatDate(isoString) {
        const date = new Date(isoString);
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        };
        return date.toLocaleDateString('en-US', options);
      }

    console.log(comments)
    const formattedDate = formatDate(comments.createdAt);


    return (
        <SingleCommentContainer>
            COMMENTS:
            <ul>
                {comments?.length > 0 && comments?.map((comment, index) => {
                    return (
                        <SingleCommentCard key={comment?.id}>
                            <SingleCommentTime>{formatDate(comment.createdAt)}</SingleCommentTime>
                            <SingleCommentAuthor>{comment?.author}<SingleCommentTime> (says): </SingleCommentTime> </SingleCommentAuthor>
                            <li > {comment?.content}</li>


                            <EditOrDeleteContainer>
                                <CommentButton handleDelete={handleDelete} commentId={comment?.id} />
                            </EditOrDeleteContainer>



                        </SingleCommentCard>
                    )
                })}
            </ul>
        </SingleCommentContainer>
    )
}
export default Comments



