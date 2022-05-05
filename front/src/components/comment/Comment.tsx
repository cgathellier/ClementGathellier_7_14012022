import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CommentProps } from './types';
import { UserContext } from '../../contexts/UserContext';
import { useAlertsDispatcher } from '../../contexts/AlertsContext';
import { instance as axios } from '../../axios.config';
import classes from './Comment.module.css';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TextField from '@mui/material/TextField';
import EditTextForm from '../editTextForm/EditTextForm';

const Comment = (props: CommentProps) => {
    const { comment, updateFeed } = props;
    const { id, author, text, likes } = comment;

    const { userContext } = React.useContext(UserContext);
    const setAlertsContext = useAlertsDispatcher();

    const navigate = useNavigate();

    const [isUpdating, setIsUpdating] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null,
    );
    const [updatedText, setUpdatedText] = React.useState('');

    const menuOpen = Boolean(anchorEl);
    let hasUserLikedComment = false;
    likes.forEach((like) => {
        if (like && userContext) {
            if (like.userId === userContext.id) {
                hasUserLikedComment = true;
            }
        }
    });
    const isLikeButtonLiked = hasUserLikedComment ? classes.liked : '';

    React.useEffect(() => {
        setUpdatedText(text);
    }, [text]);

    const handleClick = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ): void => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openUpdate = () => {
        setIsUpdating(true);
        handleClose();
    };

    const hideUpdate = () => {
        setIsUpdating(false);
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setUpdatedText(event.target.value);
    };

    const handleDelete = async () => {
        try {
            const res = await axios.delete(`/comments/${id}`);
            if (res.status === 200) {
                setAlertsContext({
                    type: 'success',
                    message: 'Le commentaire a bien été supprimé',
                });
                handleClose();
                updateFeed();
            }
        } catch (error) {
            setAlertsContext({
                type: 'error',
                message:
                    "Un problème est survenu, le commentaire n'a pas pu être supprimé",
            });
        }
    };

    const likeComment = async () => {
        const res = await axios.patch(`/comments/likes/${id}`);
        if (res.status === 200) {
            updateFeed();
        }
    };

    const goToProfile = () => {
        if (author) {
            navigate(`/profile/${author.id}`);
        }
    };

    const handleKeyPressOnAuthor = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') goToProfile();
    };

    const handleKeyPressOnLike = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') likeComment();
    };

    const submitCommentUpdate = async () => {
        try {
            const res = await axios.patch(`/comments/${id}`, {
                text: updatedText,
            });
            if (res.status === 200) {
                setAlertsContext({
                    type: 'success',
                    message: 'Le commentaire a bien été modifié',
                });
                hideUpdate();
                updateFeed();
            }
        } catch (error) {
            setAlertsContext({
                type: 'error',
                message:
                    "Un problème est survenu, la modification n'a pas pu être enregistrée",
            });
        }
    };

    return (
        <div className={classes.commentContainer}>
            <div className={classes.content}>
                <div className={classes.header}>
                    <span
                        tabIndex={0}
                        onKeyPress={handleKeyPressOnAuthor}
                        onClick={goToProfile}
                        className={classes.author}
                    >
                        {author
                            ? `${author.firstName} ${author.lastName}`
                            : 'Utilisateur supprimé'}
                    </span>
                    {userContext &&
                        (userContext.isAdmin ||
                            (author && userContext.id === author.id)) && (
                            <div>
                                <Button
                                    onClick={(e) => handleClick(e)}
                                    className={classes.menuBtn}
                                >
                                    <MoreHorizIcon />
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={menuOpen}
                                    onClose={handleClose}
                                >
                                    {author && userContext.id === author.id && (
                                        <MenuItem onClick={openUpdate}>
                                            Modifier
                                        </MenuItem>
                                    )}
                                    {((author &&
                                        userContext.id === author.id) ||
                                        userContext.isAdmin) && (
                                        <MenuItem onClick={handleDelete}>
                                            Supprimer
                                        </MenuItem>
                                    )}
                                </Menu>
                            </div>
                        )}
                </div>
                {isUpdating ? (
                    <EditTextForm
                        updatedText={updatedText}
                        handleChange={handleChange}
                        hideUpdate={hideUpdate}
                        submitUpdate={submitCommentUpdate}
                        text={text}
                    />
                ) : (
                    <span>{text}</span>
                )}
                {likes.length > 0 && (
                    <span className={classes.likes}>
                        <div className={classes.likeIconContainer}>
                            <ThumbUpAltIcon sx={{ fontSize: '0.8em' }} />
                        </div>
                        <div className={classes.likesCount}>
                            {likes?.length}
                        </div>
                    </span>
                )}
            </div>
            <div
                tabIndex={0}
                className={`${classes.likeBtn} ${isLikeButtonLiked}`}
                onClick={likeComment}
                onKeyPress={handleKeyPressOnLike}
            >
                J'aime
            </div>
        </div>
    );
};

export default Comment;
