import { FieldInputProps } from 'formik';

export interface ITextInputProps<T = any> {
	field: FieldInputProps<T>;
	form: any;
	variant?: 'filled' | 'outlined' | 'standard';
	margin?: 'normal' | 'none' | 'dense';
	required?: boolean;
	fullWidth?: boolean;
	id?: string;
	label?: string;
	// name?: string;
	autoComplete?: string;
	autoFocus?: boolean;
}
