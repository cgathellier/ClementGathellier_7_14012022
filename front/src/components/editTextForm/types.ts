export interface EditTextFormProps {
	updatedText: string;
	handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	hideUpdate: () => void;
	submitUpdate: () => Promise<void>;
	text: string;
}
