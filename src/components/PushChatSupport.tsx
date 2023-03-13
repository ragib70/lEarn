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
					supportAddress="0x7Fc7667e27cf6b7D4ee331e05865Bd8bfBC3Df10" //support address
					apiKey={pushApiKey}
					env={ENV.PROD}
				/>
			)}
		</OverlayChatBoxStyled>
	);
};

export default PushChatSupport;
