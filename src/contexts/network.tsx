import { createContext, FC, useContext, useEffect, useState } from "react";
import Web3 from "web3";
import NetworkOption from "../components/NetworkOption/NetworkOption";
import { allowedNetworkIds, networks } from "../constants/network";

export const ABI = require("../abi.json");
export const web3 = new Web3(window.ethereum);

export const NetworkContext = createContext<{
    contract: any;
    setContract: React.Dispatch<React.SetStateAction<any>>;
	selectedNetworkId?: string;
    networkOption?: boolean;
	setSelectedNetworkId: React.Dispatch<React.SetStateAction<string | undefined>>;
    setNetworkOption: React.Dispatch<React.SetStateAction<boolean>>;
}>({
    contract: undefined,
    setContract: () => {},
	setSelectedNetworkId: () => {},
    setNetworkOption: () => {}
});

const NetworkProvider: FC<{ children: any }> = ({ children }) => {
    const [contract, setContract] = useState<any>();
    const [networkOption, setNetworkOption] = useState(false);
	const [selectedNetworkId, setSelectedNetworkId] = useState<string | undefined>();

    const handleNetworkChange = (chainId: string) => {
		console.log("swithced to: ", chainId);
		const decimalString = parseInt(chainId, 16).toString();
		if (!chainId || !allowedNetworkIds.includes(decimalString)) {
			setNetworkOption(true);
			setSelectedNetworkId(undefined);
		} else {
			setNetworkOption(false);
			setSelectedNetworkId(decimalString);
            console.log(networks[decimalString].contractAddress)
			setContract(
				new web3.eth.Contract(
					ABI,
					networks[decimalString].contractAddress
				)
			);
		}
	};
    
    useEffect(() => {
		// method: net_version, would give decimal string for chaninId
		if (!window.ethereum) {
			setNetworkOption(true);
		} else {
			window.ethereum
				.request({ method: "eth_chainId" })
				.then(handleNetworkChange)
				.catch((err: any) => {
					console.log(err);
					setNetworkOption(true);
				});
			window.ethereum.on("chainChanged", handleNetworkChange);

			return () => {
				window.ethereum.removeListener(
					"chainChanged",
					handleNetworkChange
				);
			};
		}
	}, []);
    
	return (
		<NetworkContext.Provider
			value={{
                contract,
                setContract,
				selectedNetworkId,
				setSelectedNetworkId,
                networkOption,
                setNetworkOption
			}}
		>
			{children}
            <NetworkOption show={networkOption}/>
		</NetworkContext.Provider>
	);
};

export default NetworkProvider;