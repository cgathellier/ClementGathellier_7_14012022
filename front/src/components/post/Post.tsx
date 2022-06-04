import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PostProps } from './types';
import { UserContext } from '../../contexts/UserContext';
import { useAlertsDispatcher } from '../../contexts/AlertsContext';
import { instance as axios } from '../../axios.config';
import getMomentDiff from '../../moment.utils';
import classes from './Post.module.css';
import Paper from '@mui/material/Paper';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TextField from '@mui/material/TextField';
import Comment from '../comment/Comment';
import EditTextForm from '../editTextForm/EditTextForm';

const Post = (props: PostProps) => {
    const { post, updateFeed } = props;
    const { id, author, text, comments, likes } = post;

    const { userContext } = React.useContext(UserContext);
    const setAlertsContext = useAlertsDispatcher();

    const navigate = useNavigate();

    const [isUpdating, setIsUpdating] = React.useState(false);
    const [updatedText, setUpdatedText] = React.useState('');
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null,
    );
    const [showComments, setShowComments] = React.useState(false);
    const [focusCommentInput, setFocusCommentInput] = React.useState(false);
    const [commentText, setCommentText] = React.useState('');
    const [canSubmit, setCanSubmit] = React.useState(false);
    const [dateTexts, setDateTexts] = React.useState({
        diffText: '',
        formattedDate: '',
    });
    const commentInputRef = React.useRef<HTMLInputElement>(null);

    const menuOpen = Boolean(anchorEl);
    let hasUserLikedPost = false;
    likes.forEach((like) => {
        if (like && userContext) {
            if (like.userId === userContext.id) {
                hasUserLikedPost = true;
            }
        }
    });

    React.useEffect(() => {
        setUpdatedText(text);
    }, [text]);

    React.useEffect(() => {
        if (focusCommentInput && commentInputRef && commentInputRef.current) {
            commentInputRef.current.focus();
        }
    }, [focusCommentInput, commentInputRef]);

    React.useEffect(() => {
        if (commentText.trim() === '') {
            setCanSubmit(false);
        } else {
            setCanSubmit(true);
        }
    }, [commentText]);

    React.useEffect(() => {
        if (post) {
            const { diffText, formattedDate } = getMomentDiff(post.createdAt);
            if (diffText && formattedDate) {
                setDateTexts({
                    diffText,
                    formattedDate,
                });
            }
        }
    }, [post]);

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

    const handleDelete = async () => {
        try {
            const res = await axios.delete(`/posts/${id}`);
            if (res.status === 200) {
                setAlertsContext({
                    type: 'success',
                    message: 'La publication a bien été supprimée !',
                });
                handleClose();
                updateFeed();
            }
        } catch (error) {
            setAlertsContext({
                type: 'error',
                message:
                    "Un problème est survenu, la publication n'a pas pu être supprimée",
            });
        }
    };

    const handleLike = async () => {
        const res = await axios.patch(`/posts/likes/${id}`);
        if (res.status === 200) {
            updateFeed();
        }
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setUpdatedText(event.target.value);
    };

    const handleChangeComment = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setCommentText(event.target.value);
    };

    const toggleComments = (setFocus?: boolean, isOnBlur?: boolean) => {
        if (showComments && !focusCommentInput && setFocus) {
            setFocusCommentInput(true);
        } else if (!showComments && !focusCommentInput && setFocus) {
            setShowComments((prevState) => !prevState);
            setFocusCommentInput(true);
        } else {
            setShowComments((prevState) => !prevState);
            setFocusCommentInput(false);
        }
    };

    const handleCommentInputBlur = () => {
        setFocusCommentInput(false);
    };

    const handleKeyPressOnCommentsCount = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') toggleComments();
    };

    const handleKeyPressOnAuthor = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') goToProfile();
    };

    const goToProfile = () => {
        navigate(`/profile/${author.id}`);
    };

    const submitPostUpdate = async () => {
        try {
            const res = await axios.patch(`/posts/${id}`, {
                text: updatedText,
            });
            if (res.status === 200) {
                setAlertsContext({
                    type: 'success',
                    message: 'La publication a bien été modifiée !',
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

    const submitComment = async () => {
        try {
            const res = await axios.post(`/comments/${id}`, {
                text: commentText,
            });
            if (res.status === 201) {
                setAlertsContext({
                    type: 'success',
                    message: 'Le commentaire a bien été enregistré !',
                });
                setCommentText('');
                updateFeed();
            }
        } catch (error) {
            setAlertsContext({
                type: 'error',
                message:
                    "Un problème est survenu, le commentaire n'a pas pu être enregistré",
            });
        }
    };

    return (
        <div className={classes.postContainer} data-testid="post">
            <Paper elevation={0} className={classes.post}>
                <div className={classes.header}>
                    <div className={classes.postInfosContainer}>
                        <div
                            onClick={goToProfile}
                            className={classes.author}
                            onKeyPress={handleKeyPressOnAuthor}
                            tabIndex={0}
                        >{`${author.firstName} ${author.lastName}`}</div>
                        <div className={classes.diffText}>
                            {dateTexts.diffText}
                        </div>
                        <div className={classes.formattedDate}>
                            {dateTexts.formattedDate}
                        </div>
                    </div>
                    {userContext &&
                        (userContext.id === author.id ||
                            userContext.isAdmin) && (
                            <div>
                                <Button
                                    onClick={(e) => handleClick(e)}
                                    className={classes.menuBtn}
                                    aria-label="Menu modifier/supprimer la publication"
                                >
                                    <MoreHorizIcon />
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={menuOpen}
                                    onClose={handleClose}
                                >
                                    {userContext.id === author.id && (
                                        <MenuItem onClick={openUpdate}>
                                            Modifier
                                        </MenuItem>
                                    )}
                                    {(userContext.id === author.id ||
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
                        submitUpdate={submitPostUpdate}
                        text={text}
                    />
                ) : (
                    <div className={classes.text}>{text}</div>
                )}

                <div className={classes.reactions}>
                    <span className={classes.likesCount}>
                        <ThumbUpAltIcon
                            fontSize="small"
                            sx={{ marginRight: '4px' }}
                        />
                        {likes?.length}
                    </span>
                    <span
                        onKeyPress={handleKeyPressOnCommentsCount}
                        tabIndex={0}
                        className={classes.commentsCount}
                        onClick={() => toggleComments()}
                    >
                        {comments.length} commentaires
                    </span>
                </div>

                <div className={classes.barContainer}>
                    <div className={classes.bar}></div>
                </div>

                <div className={classes.reactOptions}>
                    <Button
                        className={[
                            classes.likes,
                            hasUserLikedPost && classes.liked,
                        ].join(' ')}
                        onClick={handleLike}
                    >
                        {hasUserLikedPost ? (
                            <ThumbUpAltIcon
                                fontSize="small"
                                sx={{ marginRight: '4px' }}
                            />
                        ) : (
                            <ThumbUpOffAltIcon
                                fontSize="small"
                                sx={{ marginRight: '4px' }}
                            />
                        )}
                        J'aime
                    </Button>
                    <Button
                        className={classes.likes}
                        onClick={() => toggleComments(true)}
                    >
                        <ChatBubbleOutlineIcon
                            fontSize="small"
                            sx={{ marginRight: '4px' }}
                        />
                        Commenter
                    </Button>
                </div>
                {showComments && (
                    <>
                        <div className={classes.barContainer}>
                            <div className={classes.fullBar}></div>
                        </div>
                        <div className={classes.commentFormContainer}>
                            <TextField
                                multiline
                                value={commentText}
                                placeholder="Votre commentaire..."
                                onChange={(event) => handleChangeComment(event)}
                                className={classes.commentFormInput}
                                inputRef={commentInputRef}
                                onBlur={handleCommentInputBlur}
                            />
                            <Button
                                variant="contained"
                                disabled={!canSubmit}
                                className={classes.commentFormBtn}
                                onClick={submitComment}
                            >
                                Publier
                            </Button>
                        </div>
                    </>
                )}
                {showComments && comments.length > 0 && (
                    <>
                        <div className={classes.barContainer}>
                            <div className={classes.fullBar}></div>
                        </div>
                        <div className={classes.commentsContainer}>
                            {comments.map((comment) => (
                                <Comment
                                    key={comment.id}
                                    comment={comment}
                                    updateFeed={updateFeed}
                                />
                            ))}
                        </div>
                    </>
                )}
            </Paper>
        </div>
    );
};

export default Post;
