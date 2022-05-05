import React from 'react';
import { AlertsContext } from '../../contexts/AlertsContext';
import { SnackbarCloseReason } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MUIAlert, { AlertProps } from '@mui/material/Alert';

const AlertRef = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return (
        <MUIAlert
            ref={ref}
            elevation={6}
            variant="filled"
            sx={{ width: '100%' }}
            {...props}
        />
    );
});

const CustomizedSnackbars = () => {
    const {
        alertsContext: { type, message },
        setAlertsContext,
    } = React.useContext(AlertsContext);

    const handleClose = (
        _event: Event | React.SyntheticEvent<any, Event>,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlertsContext({ type, message: '' });
    };

    return (
        <Snackbar
            open={!!message}
            autoHideDuration={3000}
            onClose={handleClose}
        >
            <AlertRef onClose={handleClose} severity={type}>
                {message}
            </AlertRef>
        </Snackbar>
    );
};

export default CustomizedSnackbars;
