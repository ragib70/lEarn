import { createContext, FC, useState } from "react";

export const PageContext = createContext<{
	searchText: string;
	setSearchText: React.Dispatch<React.SetStateAction<string>>;
}>({ searchText: "", setSearchText: () => {} });
const PageContextProvider: FC<{ children: any }> = ({ children }) => {
	const [searchText, setSearchText] = useState("");
	return (
		<PageContext.Provider
			value={{ searchText, setSearchText }}
		>
            {children}
        </PageContext.Provider>
	);
};

export default PageContextProvider;
