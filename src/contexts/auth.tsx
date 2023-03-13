import { createContext, FC, useContext, useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { useDispatch } from "react-redux";
import { SET_NOTIF } from "../state/reducer/globalState";

export type Account = { code: string; source: "storage" | "eth" };
export const AuthContext = createContext<{
	prvtKey?: string;
	setPrvtKey: React.Dispatch<React.SetStateAction<string | undefined>>;
	account?: Account;
	setAccount: React.Dispatch<React.SetStateAction<Account | undefined>>;
	ethLogin: () => Promise<void>;
}>({
	setPrvtKey: () => {},
	setAccount: () => {},
	ethLogin: async () => {},
});

const AuthProvider: FC<{ children: any }> = ({ children }) => {
	const [prvtKey, setPrvtKey] = useState<string | undefined>();
	const storageAccount = localStorage.getItem("l-earn-account");
	const [account, setAccount] = useState<Account | undefined>(
		storageAccount ? { code: storageAccount, source: "storage" } : undefined
	);
	const dispatch = useDispatch();

	const ethLogin = async () => {
		try {
			window.ethereum
				.request({
					method: "eth_requestAccounts",
				})
				.then(async (accounts: string[]) => {
					console.log(accounts);
					if (accounts.length === 0) {
						console.log("no accounts found");
						return null;
					}
					setAccount({ code: accounts[0], source: "eth" });
				})
				.catch((err: any) => {
					dispatch({
						type: SET_NOTIF,
						payload: {
							type: "error",
							text: err.message,
						},
					});
					setAccount(undefined);
				});
		} catch (err) {
			throw Error("LoginError: Etherium is not connected");
		}
	};

	const logout = () => {
		setAccount(undefined);
	};
	useEffect(() => {
		if (account && account.code && account.source !== "storage") {
			localStorage.setItem("l-earn-account", account.code);
		} else if (isEmpty(account?.code)) {
			localStorage.removeItem("l-earn-account");
		}

		if (account?.code && account.source === "storage") {
			try {
				window.ethereum
					.request({
						method: "eth_requestAccounts",
					})
					.then(async (accounts: string[]) => {
						console.log(accounts);
						if (
							!isEmpty(accounts) &&
							accounts[0] === account.code
						) {
							// setAccount({code: accounts[0], source: 'eth'});
						} else {
							console.log("account changed or do not exist");
							setAccount(undefined);
						}
					})
					.catch((err: any) => {
						dispatch({
							type: SET_NOTIF,
							payload: {
								type: "error",
								text: err.message,
							},
						});
						setAccount(undefined);
					});
			} catch (err) {
				throw Error("LoginError: Etherium is not connected");
			}
		}
	}, [account]);

	useEffect(() => {
		const handleAccountChange = (accounts: Array<string>) => {
			if (isEmpty(accounts) || accounts[0] !== account?.code) {
				setAccount(undefined);
			}
		};

		window.ethereum.on("accountsChanged", handleAccountChange);
		return () => {
			window.ethereum.removeListener(
				"accountsChanged",
				handleAccountChange
			);
		};
	}, []);

	return (
		<AuthContext.Provider
			value={{
				prvtKey,
				setPrvtKey,
				account,
				setAccount,
				ethLogin,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
