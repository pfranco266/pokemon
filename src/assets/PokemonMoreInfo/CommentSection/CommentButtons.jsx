import React, {useState} from "react";

import {MessageAbove, ButtonSlideDownDiv, MiddleButtonWrapper,EditOrDeleteContainer, DeleteButton, CancelLower, ButtonWrapperDiv} from "./CommentSection.styled"

function CommentButton ({commentId, handleDelete, author=null, targetEdit=null}) {
    const [isConfirming, setIsConfirming] = useState(false);


    const handleDeleteClick = () => {

        if (isConfirming) {
          handleDelete(commentId);
        } else {
          setIsConfirming(true);
        }
      };

      const handleCancelClick = () => {
        setIsConfirming(false);
      };


      
      return (
        <EditOrDeleteContainer>
     
          <ButtonWrapperDiv>
            {isConfirming  && <MessageAbove isConfirming={isConfirming}>Are you sure you want to delete?</MessageAbove>}
            <MiddleButtonWrapper>
              <DeleteButton onClick={handleDeleteClick}>{isConfirming ? 'Yes' : 'Delete Comment'}</DeleteButton>
            </MiddleButtonWrapper>
            {isConfirming && (
              <ButtonSlideDownDiv isConfirming={isConfirming}>
                <CancelLower onClick={handleCancelClick}>no</CancelLower>
              </ButtonSlideDownDiv>
            )}
          </ButtonWrapperDiv>
          </EditOrDeleteContainer>
      );
    };
    
    export default CommentButton;



