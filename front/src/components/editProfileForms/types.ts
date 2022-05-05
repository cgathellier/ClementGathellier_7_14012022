import React from 'react';
import { UserContextInfos } from '../../contexts/UserContext';

export interface EditProfileFormsProps {
    setSelectedForm: React.Dispatch<React.SetStateAction<string | null>>;
}
export interface EditInfosFormValues {
    email: string;
    firstName: string;
    lastName: string;
}

export interface EditPasswordFormValues {
    password: string;
    newPassword: string;
    confirmPassword: string;
}
