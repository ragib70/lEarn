export type Network = { label: string; chainId: string; rpcUrls: string[], contractAddress?: string, image?: string; };
export const networks: { [key: string]: Network } = {
	"80001": {
        image: '/network-80001.png',
		label: "Mumbai",
		chainId: "80001",
		rpcUrls: [
			"https://matic-mumbai.chainstacklabs.com",
			"https://polygon-testnet.public.blastapi.io",
			"https://polygon-mumbai.blockpi.network/v1/rpc/public",
		],
        contractAddress: '0x4cc953F6a4099f478923715adEBfbd7354bab8Ff'
	},
	"137": {
		label: "Polygon Mainnet",
		chainId: "137",
		rpcUrls: ["https://polygon-rpc.com	"],
	},
	"3141": {
        image: '/network-3141.svg',
		label: "Filecoin Hyperspace testnet",
		chainId: "3141",
		rpcUrls: ["https://filecoin-hyperspace.chainstacklabs.com/rpc/v1"],
        contractAddress: '0x3352bDCbdC445aBc5bEBbbec44745968fC038AeC'
	},
    "5001": {
        image: '/network-5001.svg',
        label: 'Mantle Testnet',
        chainId: '5001',
        rpcUrls: ["https://rpc.testnet.mantle.xyz"],
        contractAddress: '0x87e940bF5c8FC26ad9F80985D23176D21646423E'
    },
    "10200": {
		label: "Chiado",
        image: '/gnosis.png',
		chainId: "10200",
		rpcUrls: ["https://rpc.chiadochain.net"],
        contractAddress: '0x8F47376eFE5CA9f9b9641a093FA71436192484A5'
	},
	"534353": {
        image: '/scroll.ico',
		label: "Scroll",
		chainId: "534353",
		rpcUrls: ["https://alpha-rpc.scroll.io/l2"],
        contractAddress: '0x8F47376eFE5CA9f9b9641a093FA71436192484A5'
	},
    "1442": {
        image: '/polygon-zkevm.svg',
        label: 'Polygon zkEVM',
        chainId: '1442',
        rpcUrls: ["https://rpc.public.zkevm-test.net"],
        contractAddress: '0x8F47376eFE5CA9f9b9641a093FA71436192484A5'
    },
    "420": {
        image: '/optimism.png',
        label: 'Optimism Testnet',
        chainId: '420',
        rpcUrls: ["https://goerli.optimism.io"],
        contractAddress: '0x8F47376eFE5CA9f9b9641a093FA71436192484A5'
    },
};

export const allowedNetworkIds: {[key: string]: string[]} = {'metamask': ["80001", "3141", "5001", "10200", "534353", "1442", "420"], 'fuel': [], 'default': []};

export const pushApiKey = 'ZaCrOdyBNN.ajF5Igu8ppOfNkxiuiQGoXDyhTkd8sY4gG1v7aa822iVMJSnBE9zp1cXjDgUIPHC';