import React from 'react';
import { UseFormHandleSubmit } from 'react-hook-form';
import { EditInfosFormValues } from '../editProfileForms/types';

export interface ConfirmDialogProps {
    open: boolean;
    handleClose: () => void;
    title: string;
    buttonText: string;
    submit: (model?: EditInfosFormValues) => void;
    handleSubmit?: UseFormHandleSubmit<EditInfosFormValues>;
    email: string;
    setSelectedForm: React.Dispatch<React.SetStateAction<string | null>>;
}
