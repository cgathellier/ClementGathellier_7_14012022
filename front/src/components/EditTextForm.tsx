import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

interface EditTextFormProps {
    updatedText: string;
    handleChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    hideUpdate: () => void;
    submitUpdate: () => Promise<void>;
    text: string;
}

const EditTextForm = (props: EditTextFormProps) => {
    const { updatedText, handleChange, hideUpdate, submitUpdate, text } = props;

    const textAreaRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (textAreaRef && textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, []);

    const handleFocus = () => {
        if (textAreaRef && textAreaRef.current) {
            textAreaRef.current.setSelectionRange(
                updatedText.length,
                updatedText.length,
            );
        }
    };

    return (
        <form className="editTextForm">
            <TextField
                fullWidth
                multiline
                value={updatedText}
                onChange={(event) => handleChange(event)}
                inputRef={textAreaRef}
                onFocus={handleFocus}
                inputProps={{
                    'data-testid': 'editTextInput',
                }}
            />
            <div className="cancelable-forms__buttons-container">
                <Button
                    variant="outlined"
                    onClick={hideUpdate}
                    disabled={!updatedText}
                    className="cancelable-forms__button"
                >
                    Annuler
                </Button>
                <Button
                    variant="contained"
                    onClick={submitUpdate}
                    disabled={
                        !updatedText || updatedText.trim() === text.trim()
                    }
                    className="cancelable-forms__button"
                    data-testid="submitEditedText"
                >
                    Enregistrer
                </Button>
            </div>
        </form>
    );
};

export default EditTextForm;
