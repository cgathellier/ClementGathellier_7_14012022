import { Author } from '../post/types';

interface Likes {
	userId: number;
	commentId: number;
}

export interface CommentType {
	id: number;
	author: Author | null;
	authorId: number;
	postId: number;
	createdAt: Date;
	updatedAt: Date;
	text: string;
	likes: Likes[];
}

export interface CommentProps {
	comment: CommentType;
	updateFeed: () => void;
}
