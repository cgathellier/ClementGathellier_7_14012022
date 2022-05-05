import { CommentType } from '../comment/types';
export interface Author {
    id: number;
    firstName: string;
    lastName: string;
}

interface Likes {
    userId: number;
    postId: number;
}

export interface PostType {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    text: string;
    author: Author;
    authorId: number;
    comments: CommentType[]; // ajouter le type Comment quand il sera créé
    likes: Likes[];
}

export interface PostProps {
    post: PostType;
    updateFeed: () => void;
}
