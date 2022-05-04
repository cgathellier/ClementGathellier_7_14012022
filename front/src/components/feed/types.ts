import { PostType } from '../post/types';

export interface FeedProps {
	posts?: PostType[];
	profileId?: number;
	updateProfile?: () => void;
}
