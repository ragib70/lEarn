import { Contract } from "fuels";
import {
	createContext,
	FC,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import Web3 from "web3";
import NetworkOption from "../components/NetworkOption/NetworkOption";
import { allowedNetworkIds, networks } from "../constants/network";

export const ABI = require("../abi.json");
export const _abi = {
    "types": [
      {
        "typeId": 0,
        "type": "()",
        "components": [],
        "typeParameters": null
      },
      {
        "typeId": 1,
        "type": "u64",
        "components": null,
        "typeParameters": null
      }
    ],
    "functions": [
      {
        "inputs": [],
        "name": "count",
        "output": {
          "name": "",
          "type": 1,
          "typeArguments": null
        }
      },
      {
        "inputs": [],
        "name": "increment",
        "output": {
          "name": "",
          "type": 0,
          "typeArguments": null
        }
      }
    ],
    "loggedTypes": []
  };

export const web3 = new Web3(window.ethereum);
export type WalletProvider = "metamask" | "fuel";
export type Wallet = { provider: WalletProvider; api: any };

export const NetworkContext = createContext<{
	contract: any;
	setContract: React.Dispatch<React.SetStateAction<any>>;
	selectedNetworkId?: string;
	networkOption?: boolean;
	setSelectedNetworkId: React.Dispatch<
		React.SetStateAction<string | undefined>
	>;
	setNetworkOption: React.Dispatch<React.SetStateAction<boolean>>;
	wallet?: Wallet;
	setWallet: React.Dispatch<React.SetStateAction<Wallet | undefined>>;
	fuel?: any;
}>({
	contract: undefined,
	setContract: () => {},
	setSelectedNetworkId: () => {},
	setNetworkOption: () => {},
	setWallet: () => {},
});

const NetworkProvider: FC<{ children: any }> = ({ children }) => {
	const [wallet, setWallet] = useState<Wallet | undefined>();
	const [contract, setContract] = useState<any>();
	const [networkOption, setNetworkOption] = useState(false);
	const [selectedNetworkId, setSelectedNetworkId] = useState<
		string | undefined
	>();
	const [fuel, setFuel] = useState<any>();

	useEffect(() => {
		// method: net_version, would give decimal string for chaninId
		if (wallet?.provider === "fuel" && !fuel) {
			return;
		}

		const handleEthereumNetworkChange = (chainId: string) => {
			console.log("swithced to: ", chainId);
			const decimalString = parseInt(chainId, 16).toString();
			if (
				!chainId ||
				!allowedNetworkIds["metamask"].includes(decimalString)
			) {
				setNetworkOption(true);
				setSelectedNetworkId(undefined);
			} else {
				setNetworkOption(false);
				setSelectedNetworkId(decimalString);
				console.log(networks[decimalString].contractAddress);
				setContract(
					new web3.eth.Contract(
						ABI,
						networks[decimalString].contractAddress
					)
				);
			}
		};

		if (wallet?.provider === "metamask") {
			if (!window.ethereum) {
				setNetworkOption(true);
				return;
			} else {
				window.ethereum
					.request({ method: "eth_chainId" })
					.then(handleEthereumNetworkChange)
					.catch((err: any) => {
						console.log(err);
						setNetworkOption(true);
					});
				window.ethereum.on("chainChanged", handleEthereumNetworkChange);

				return () => {
					window.ethereum.removeListener(
						"chainChanged",
						handleEthereumNetworkChange
					);
				};
			}
		}
	}, [wallet]);

	useEffect(() => {
		const onFuelLoaded = () => {
			setFuel(window.fuel);
		};
		if (window.fuel) {
			onFuelLoaded();
			return;
		}

		// Listen for the fuelLoaded event
		document.addEventListener("FuelLoaded", onFuelLoaded);
		return () => {
			document.removeEventListener("FuelLoaded", onFuelLoaded);
		};
	}, []);

	return (
		<NetworkContext.Provider
			value={{
				contract,
				setContract,
				selectedNetworkId,
				setSelectedNetworkId,
				networkOption,
				setNetworkOption,
				wallet,
				setWallet,
				fuel,
			}}
		>
			{children}
			<NetworkOption show={networkOption} />
		</NetworkContext.Provider>
	);
};

export default NetworkProvider;
