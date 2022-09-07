import React from 'react';
import { instance as axios } from '../axios.config';
import { PostType } from './Post';
import { UserContext } from '../contexts/UserContext';
import { useAlertsDispatcher } from '../contexts/AlertsContext';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Spinner from './Spinner';
import PostForm from './PostForm';

interface FeedProps {
    posts?: PostType[];
    profileId?: number;
    updateProfile?: () => void;
}

const Post = React.lazy(() => import('./Post'));

const Feed = (props: FeedProps) => {
    const { posts: propsPosts, profileId, updateProfile } = props;

    const { userContext } = React.useContext(UserContext);
    const setAlertsContext = useAlertsDispatcher();

    const [posts, setPosts] = React.useState<PostType[]>([]);
    const [postFormOpen, setPostFormOpen] = React.useState(false);

    const getAllPosts = React.useCallback(async () => {
        try {
            if (updateProfile) {
                return updateProfile();
            }
            const res = await axios.get('/posts');
            if (res.status === 200) {
                setPosts(res.data);
            } else if (res.status === 500) {
                setAlertsContext({
                    type: 'error',
                    message:
                        'Impossible de charger les publications, merci de réessayer plus tard',
                });
            }
        } catch (error) {}
    }, [setAlertsContext, updateProfile]);

    const openPostForm = () => {
        setPostFormOpen(true);
    };

    const closePostForm = (shouldRefreshPosts: boolean = false) => {
        setPostFormOpen(false);
        if (shouldRefreshPosts) {
            getAllPosts();
        }
    };

    React.useEffect(() => {
        if (propsPosts) {
            setPosts(propsPosts);
        } else {
            getAllPosts();
        }
    }, [propsPosts, profileId, getAllPosts]);

    return (
        <div className="feed">
            {(!profileId || profileId === userContext?.id) && (
                <Paper elevation={0} className="feed__open-post-form-container">
                    <Button
                        className="feed__open-post-form"
                        onClick={openPostForm}
                        variant="outlined"
                        data-testid="openPostForm"
                    >
                        Créer une publication...
                    </Button>
                </Paper>
            )}
            <React.Suspense fallback={<Spinner />}>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Post
                            post={post}
                            key={post.id}
                            updateFeed={getAllPosts}
                        />
                    ))
                ) : (
                    <span className="feed__no-posts">
                        Aucune publication à afficher
                    </span>
                )}
            </React.Suspense>
            {postFormOpen && (
                <PostForm open={postFormOpen} handleClose={closePostForm} />
            )}
        </div>
    );
};

export default Feed;
