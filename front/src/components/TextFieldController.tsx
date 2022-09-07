import React from 'react';
import {
    Controller,
    Control,
    UnpackNestedValue,
    FieldPathValue,
    FieldValues,
    FieldPath,
} from 'react-hook-form';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

export interface TextFieldControllerProps<T extends FieldValues> {
    name: FieldPath<T>;
    label: string;
    defaultValue: UnpackNestedValue<FieldPathValue<FieldValues, ''>>;
    helperText?: string;
    control: Control<T>;
    rules?: object;
    type?: string;
    inputProps?: object;
}

const muiStyles = {
    textField: {
        marginBottom: '4px !important',
        marginTop: '12px !important',
    },
    helperText: {
        margin: '0px !important',
    },
};

const TextFieldController = <T extends FieldValues>({
    name,
    label,
    defaultValue,
    control,
    rules,
    helperText,
    type,
    inputProps,
}: TextFieldControllerProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            rules={rules}
            render={({
                field: { ref, ...restField },
                fieldState: { error },
            }) => (
                <FormControl fullWidth error={!!error}>
                    <TextField
                        type={type || 'text'}
                        label={label}
                        margin="normal"
                        fullWidth
                        inputRef={ref}
                        sx={muiStyles.textField}
                        inputProps={inputProps}
                        {...restField}
                    />
                    {error ? (
                        <FormHelperText sx={muiStyles.helperText}>
                            {!!error?.message && error.message}
                        </FormHelperText>
                    ) : helperText ? (
                        <FormHelperText sx={muiStyles.helperText}>
                            {helperText}
                        </FormHelperText>
                    ) : (
                        <FormHelperText sx={muiStyles.helperText}>
                            {' '}
                        </FormHelperText>
                    )}
                </FormControl>
            )}
        />
    );
};

export default TextFieldController;
