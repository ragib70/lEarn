import {
	createContext,
	FC,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { isEmpty } from "lodash";
import { useDispatch } from "react-redux";
import { SET_NOTIF } from "../state/reducer/globalState";
import { NetworkContext, WalletProvider } from "./network";
import { Contract, Wallet } from "fuels";
import { networks, ZK_GATE_CONTRACT } from "../constants/network";
import { fuel_abi } from "../constants/abi";
import {
	Box,
	Button,
	Divider,
	IconButton,
	Link,
	Modal,
	Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@emotion/react";
import { tokens } from "./theme";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "27rem",
	borderRadius: 3,
	boxShadow: 24,
};

export type Account = {
	code: string;
	source: "storage" | "eth";
	verified: boolean;
};
export const AuthContext = createContext<{
	prvtKey?: string;
	setPrvtKey: React.Dispatch<React.SetStateAction<string | undefined>>;
	account?: Account;
	setAccount: React.Dispatch<React.SetStateAction<Account | undefined>>;
	ethLogin: (provider?: "metamask" | "fuel") => Promise<any>;
	zkGateLogin: (data: Account) => Promise<void>;
}>({
	setPrvtKey: () => {},
	setAccount: () => {},
	ethLogin: async () => {},
	zkGateLogin: async () => {},
});

const AuthProvider: FC<{ children: any }> = ({ children }) => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);

	const { setWallet, wallet, setContract, fuel, selectedNetworkId } =
		useContext(NetworkContext);
	const [prvtKey, setPrvtKey] = useState<string | undefined>();
	const storageAccount = localStorage.getItem("l-earn-account");
	const [account, setAccount] = useState<Account | undefined>(
		storageAccount
			? { code: storageAccount, source: "storage", verified: true }
			: undefined
	);
	const dispatch = useDispatch();
	const [resultModal, setResultModal] = useState({
		show: false,
		verified: false,
	});

	const zkGateLogin = async (data: Account) => {
		console.log(data);
		return ZK_GATE_CONTRACT.methods
			.getURI()
			.call({
				from: data.code,
			})
			.then(async (res: any) => {
				const metadata = await fetch(res).then((data) => data.json());
				console.log("metadata", metadata);
				ZK_GATE_CONTRACT.methods
					.getAccess(
						metadata.proof.a,
						metadata.proof.b,
						metadata.proof.c,
						metadata.proof.pub_signal
					)
					.call()
					.then((verified: boolean) => {
						console.log("verified:", verified);
						if (!verified) {
							throw Error("access denied");
						}
						setAccount({ ...data, verified: true });
						setWallet(window.ethereum);
            setResultModal({show: true, verified: true})
					});
				// console.log("metadata", metadata);
				// console.log("successful login");
			})
			.catch((err: any) => {
        setResultModal({show: true, verified: false})
				console.error(err);
				setAccount(undefined);
				dispatch({
					type: SET_NOTIF,
					payload: {
						type: "error",
						text: err.message,
					},
				});
			});
	};

	const ethLogin = async (provider: WalletProvider = "metamask") => {
		try {
			return (
				provider === "metamask"
					? window.ethereum.request({
							method: "eth_requestAccounts",
					  })
					: provider === "fuel"
					? window.fuel
							.connect()
							.then(() =>
								window.fuel
									.currentAccount()
									.then((acc: string) => [acc])
							)
					: new Promise<string[]>((resolve, reject) => {})
			)
				.then(async (accounts: string[]) => {
					console.log(accounts);
					if (accounts.length === 0) {
						console.log("no accounts found");
						return null;
					}
					return {
						code: accounts[0],
						source: "eth",
						verified: false,
					};
					setWallet({
						provider,
						api:
							provider === "metamask"
								? window.ethereum
								: window.fuel,
					});
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
					throw Error("LoginError: Etherium error");
				});
		} catch (err) {
			throw Error("LoginError: Etherium is not connected");
		}
	};

	useEffect(() => {
		if (account && account.code && account.source !== "storage") {
			localStorage.setItem("l-earn-account", account.code);
		} else if (isEmpty(account?.code)) {
			localStorage.removeItem("l-earn-account");
		}

		if (account?.source !== "storage" && wallet?.provider) {
			localStorage.setItem("l-earn-wallet-provider", wallet.provider);
		} else if (!wallet?.provider) {
			localStorage.removeItem("l-earn-wallet-provider");
		}

		if (account?.code && account.source === "storage" && fuel) {
			try {
				(wallet?.provider === "metamask"
					? window.ethereum.request({
							method: "eth_requestAccounts",
					  })
					: wallet?.provider === "fuel"
					? fuel
							.connect()
							.then(() =>
								window.fuel
									.currentAccount()
									.then((acc: string) => [acc])
							)
					: new Promise<string[]>((resolve, reject) => {})
				)
					.then(async (accounts: string[]) => {
						console.log(accounts);
						if (
							!isEmpty(accounts) &&
							accounts[0] === account.code
						) {
							setAccount({
								code: accounts[0],
								source: "eth",
								verified: false,
							});
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
				throw err;
			}
		}
	}, [account, wallet, fuel]);
	useEffect(() => {
		if (
			account?.code &&
			wallet?.provider === "fuel" &&
			fuel &&
			selectedNetworkId === "fuel0"
		) {
			fuel.getWallet(account.code).then((fuelWallet: any) => {
				console.log("fuel wallet", fuelWallet);
				const id = networks[selectedNetworkId].contractAddress || "";
				const contract = new Contract(id, fuel_abi, fuelWallet);
				console.log("fuel contract", contract);
				setContract(contract);
			});
		}
	}, [account, wallet, fuel, selectedNetworkId]);

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
				zkGateLogin,
			}}
		>
			{children}
			<Modal
				open={resultModal.show}
				aria-labelledby="parent-modal-title"
				aria-describedby="parent-modal-description"
			>
				<Box
					sx={{
						...style,
						backgroundColor: colors.blueAccent[800],
						padding: "10px 0 20px 0",
					}}
				>
					<Box
						display="flex"
						alignItems="start"
						padding={"15px 0 15px 0"}
						sx={{
							px: 4,
						}}
					>
						<Box>
							<Typography
								variant="h3"
								color={colors.grey[100]}
								paddingLeft={1}
							>
								{resultModal.verified
									? "You have succssfully logged in."
									: "Access Denied!"}
							</Typography>
							<Divider sx={{ margin: "20px 0 20px 0" }} />
							<Typography
								variant="h6"
								color={colors.grey[100]}
								paddingLeft={1}
							>
								{resultModal.verified ? (
									"Welcome to Learn app."
								) : (
									<span>
										You are a new user. Please click{" "}
										<Link href="https://zk-gate.web.app/" target="_blank"  color={colors.primary[100]}>
											here
										</Link>{" "}
										to generate zk-GATE NFT for this app.
									</span>
								)}
							</Typography>
						</Box>
						<IconButton
							onClick={() => {
								setResultModal({
									...resultModal,
									show: false,
								});
							}}
							sx={{ marginLeft: "auto" }}
						>
							<CloseIcon />
						</IconButton>
					</Box>
					{/* <Box display="flex" marginTop={3} sx={{ px: 4 }}>
							<Button
								variant="outlined"
								sx={{
									ml: "auto",
									backgroundColor: colors.primary[400],
									color: colors.primary[100],
								}}
								onClick={() => {navigate(`/courses/${path2}/?activeContent=${path3}`)}}
							>
								<ArrowBackIcon />
								Back to course
							</Button>
						</Box> */}
				</Box>
			</Modal>
		</AuthContext.Provider>
	);
};

export default AuthProvider;
