import { useTheme } from "@emotion/react";
import { styled } from "@mui/material";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { tokens } from "../contexts/theme";
import { Chat, ENV } from "@pushprotocol/uiweb";
import { AuthContext } from "../contexts/auth";
import { pushApiKey } from "../constants/network";

const OverlayChatBoxStyled = styled("div")(({ theme }) => ({
	zIndex: 11,
	position: "fixed",
	right: "50px",
	bottom: theme.spacing(4),
}));

const PushChatSupport: FC = () => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const { account } = useContext(AuthContext);

	return (
		<OverlayChatBoxStyled role="presentation">
			{account?.code && (
				<Chat
					account={account.code} //user address
					supportAddress="0x9333576376701Bb6D5412DB6D068eFF6E0e310Fd" //support address
					apiKey={pushApiKey}
					env={ENV.PROD}
				/>
			)}
		</OverlayChatBoxStyled>
	);
};

export default PushChatSupport;
