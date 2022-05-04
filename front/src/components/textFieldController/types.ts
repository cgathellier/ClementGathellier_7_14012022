import { SignupFormValues } from '../signupForm/types';
import { LoginFormValues } from '../loginForm/types';
import { Control, UnpackNestedValue, FieldPathValue, FieldValues } from 'react-hook-form';

type Name = 'firstName' | 'lastName' | 'email' | 'password' | 'newPassword' | 'confirmPassword';

type MixedControl = Control<SignupFormValues> | Control<LoginFormValues>;

interface TFieldValues extends FieldValues {}

export interface TextFieldControllerProps {
	name: Name;
	label: string;
	defaultValue: UnpackNestedValue<FieldPathValue<TFieldValues, ''>>;
	helperText?: string;
	control: any;
	rules?: object;
	type?: string;
}
