import React, { useEffect, useState, useReducer } from "react";
import { CommentSectionContainer, CommentForm, CommentLabel, AuthorInput, CommentTextField, CommentSubmitButton } from "./CommentSection.styled";
import { v4 as uuid } from 'uuid';
import Comments from "./Comments"
import { initialComments, commentReducer } from "../../Reducers/commentsReducer";

function CommentSection({ id }) {


    const [edit, setEdit] = useState({
        isEdit: false,
        editId: null
    });
    const [textField, setTextField] = useState('')
    const [inputField, setInputField] = useState('')

    const [comments, setComments] = useReducer(commentReducer, initialComments);

    //fetch initial comments
    async function fetchComments(id) {
        try {
            const res = await fetch(`http://localhost:3000/collection/${id}`);
            const data = await res.json();

            setComments({
                type: 'fetchComments',
                payload: data.data
            })


        } catch (error) {
            console.error('Fetch error:', error);
        }
    }



    useEffect(() => {
        fetchComments(id);
        setTextField('')
    }, [id])



    //handle the submission 
    async function handleSubmit(e) {
        e.preventDefault();
        
        const commentContent = e.target.elements.comment.value.trim();
        const authorContent = e.target.elements.author.value.trim();
    
        if (!commentContent || !authorContent) {
            return alert('Both comment and author fields must be filled out.');
        }
    
        const commentData = {
            id: edit.isEdit ? edit.editId : uuid(),
            content: commentContent,
            pokemonId: id,
            author: authorContent
        };
    
        try {
            const res = await fetch(`http://localhost:3000/collection/${id}`, {
                method: edit.isEdit ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData),
            });
    
            if (!res.ok) {
                throw new Error('Error posting comment');
            }
    
            const data = await res.json();
            console.log('Response data:', data);
    
            setComments({
                type: edit.isEdit ? 'editComment' : 'submitComment',
                payload: data.comment,
            });
    
            setTextField('');
            setEdit(false);
        } catch (error) {
            console.log(error.message);
            setEdit(false);
        }
    }
    
    async function handleEdit(commentId, author, targetEdit) {
        if (author !== inputField) {
            return alert('Halt, you are not the author');
        }
        setInputField(author);
        setTextField(targetEdit);
        setEdit({
            isEdit: true,
            editId: commentId
        });
    }
    

    async function handleDelete(commentId) {

        try {
            const res = await fetch(`http://localhost:3000/collection/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ commentId }),
            })

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Failed to delete comment:', errorText);
                throw new Error('Failed to delete comment');
            }
            const data = await res.json();
            console.log(data); 

            setComments({
                type: 'deleteComment',
                payload: commentId,
            });
            

        } catch (error) {
            console.log(error.message)
        }
    }

    function handleUsernameChange(e) {
        setInputField(e.target.value);
    }

    function handleCommentChange(e) {
        setTextField(e.target.value);
    }

    return (
        <CommentSectionContainer>
            <CommentForm onSubmit={handleSubmit} >
                <CommentLabel htmlFor="Comments">Add a Comment:</CommentLabel>
                <AuthorInput
                    placeholder="add your username"
                    value={inputField}
                    name="author"
                    onChange={handleUsernameChange}
                />
                <CommentTextField
                    placeholder="Bulbasaur is way better than the other starter Pokemon..."
                    name="comment"
                    value={textField} onChange={handleCommentChange} />
                <CommentSubmitButton type="submit">Submit Comment</CommentSubmitButton>
            </CommentForm>
            <Comments handleEdit={handleEdit} handleDelete={handleDelete} comments={comments?.commentsList} />
        </CommentSectionContainer>
    )
}

export default CommentSection