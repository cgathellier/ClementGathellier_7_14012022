import React, { ReactElement } from 'react';

export type UserContextInfos = {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	isAdmin: boolean;
};

type ProviderProps = {
	value?: {
		userContext: UserContextInfos | null;
		setUserContext: React.Dispatch<React.SetStateAction<UserContextInfos | null>>;
	};
	children: ReactElement | ReactElement[];
};

export const UserContext = React.createContext<{
	userContext: UserContextInfos | null;
	setUserContext: React.Dispatch<React.SetStateAction<UserContextInfos | null>>;
}>({ userContext: null, setUserContext: () => null });

export function UserContextProvider(props: ProviderProps): JSX.Element {
	const [userContext, setUserContext] = React.useState<UserContextInfos | null>(null);
	const value = React.useMemo(
		() => ({ userContext, setUserContext }),
		[userContext, setUserContext]
	);

	return <UserContext.Provider value={value} {...props} />;
}
