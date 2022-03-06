import { TextField } from '@material-ui/core';
import { ITextInputProps } from '../../types/Input.interface';

const FieldTextInput = ({
	field,
	form,
	variant,
	margin,
	...props
}: ITextInputProps) => {
	return (
		<TextField
			variant={variant || 'outlined'}
			margin={margin || 'normal'}
			{...props}
			{...field}
		/>
	);
};
export default FieldTextInput;
