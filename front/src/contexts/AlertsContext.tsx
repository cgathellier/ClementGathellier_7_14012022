import React from 'react';

export type AlertsContextObj = {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
};

type ProviderProps = {
    value?: {
        alertsContext: AlertsContextObj;
        setAlertsContext: React.Dispatch<
            React.SetStateAction<AlertsContextObj>
        >;
    };
    children: React.ReactElement | React.ReactElement[];
};

const initialState: AlertsContextObj = {
    type: 'info',
    message: '',
};

export const AlertsContext = React.createContext<{
    alertsContext: AlertsContextObj;
    setAlertsContext: React.Dispatch<React.SetStateAction<AlertsContextObj>>;
}>({
    alertsContext: initialState,
    setAlertsContext: () => null,
});

export const AlertsContextProvider = (props: ProviderProps) => {
    const [alertsContext, setAlertsContext] =
        React.useState<AlertsContextObj>(initialState);
    const value = React.useMemo(
        () => ({ alertsContext, setAlertsContext }),
        [alertsContext, setAlertsContext],
    );

    return <AlertsContext.Provider value={value} {...props} />;
};

export function useAlertsDispatcher() {
    const { setAlertsContext } = React.useContext(AlertsContext);
    return setAlertsContext;
}
