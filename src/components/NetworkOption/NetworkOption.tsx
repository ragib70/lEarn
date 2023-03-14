import { useTheme } from "@emotion/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { FC, useContext, useMemo, useState } from "react";
import { allowedNetworkIds, networks } from "../../constants/network";
import { AuthContext } from "../../contexts/auth";
import { NetworkContext } from "../../contexts/network";
import { tokens } from "../../contexts/theme";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "30rem",
	borderRadius: 3,
	boxShadow: 24,
};

const NetworkOption: FC<{ show: boolean }> = (props) => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const { setSelectedNetworkId, selectedNetworkId, setNetworkOption, wallet } =
		useContext(NetworkContext);
	const [error, setError] = useState<any>();
	return (
		<Modal
			open={props.show}
			aria-labelledby="parent-modal-title"
			aria-describedby="parent-modal-description"
		>
			<Box sx={{ ...style, backgroundColor: colors.blueAccent[800] }}>
				<Box
					display="flex"
					alignItems="start"
					padding={"15px 0 15px 0"}
					sx={{
						borderWidth: "0 0 3px 0",
						borderStyle: "solid",
						borderColor: colors.grey[800],
						px: 4,
					}}
				>
					<Box>
						<Typography
							variant="h3"
							color={colors.grey[100]}
							paddingLeft={1}
						>
							Unsupported network!
						</Typography>
						<Typography
							variant="h6"
							color={colors.grey[100]}
							paddingLeft={1}
						>
							Please select among allowed networks.
						</Typography>
					</Box>
					{selectedNetworkId &&
						allowedNetworkIds[wallet?.provider || 'default'].includes(selectedNetworkId) && (
							<IconButton
								onClick={() => {
									setNetworkOption(false);
								}}
								sx={{ marginLeft: "auto" }}
							>
								<CloseIcon />
							</IconButton>
						)}
				</Box>
				<Box sx={{ px: 4, py: 3 }}>
					<div hidden={!window.ethereum}>
						{allowedNetworkIds[wallet?.provider || 'default'].map((id, index) => (
							<Button
								key={`network-option-${id}`}
								fullWidth
								sx={{
									"&:hover": {
										backgroundColor: colors.primary[800],
									},
									display: "flex",
									justifyContent: "start",
									margin: "5px 0 0 0",
									padding: "10px 20px 10px 20px",
									borderRadius: "10px",
								}}
								onClick={() => {
									window.ethereum
										.request({
											method: "wallet_switchEthereumChain",
											params: [
												{
													chainId: `0x${parseInt(
														id
													).toString(16)}`,
												},
											],
										})
										.then((res: any) => {
											// setSelectedNetworkId(id);
										})
										.catch((err: any) => {
											console.log(err);
											if (err.code === 4902) {
												window.ethereum
													.request({
														method: "wallet_addEthereumChain",
														params: [
															{
																chainId: `0x${parseInt(
																	id
																).toString(
																	16
																)}`,
																chainName:
																	networks[id]
																		.label,
																rpcUrls:
																	networks[id]
																		.rpcUrls,
															},
														],
													})
													.then((res: any) => {
														// setSelectedNetworkId(id);
													})
													.catch((err: any) => {
														console.log(err);
														setError(err);
													});
											} else {
												setError(err);
											}
										});
								}}
								disabled={selectedNetworkId === id}
							>
								<img
									src={`${process.env.PUBLIC_URL}/asset/${networks[id]?.image}`}
									height="40px"
									width="40px"
								/>
								<Typography
									color={colors.grey[100]}
									marginLeft={2}
								>
									{networks[id]?.label}
								</Typography>
								{selectedNetworkId === id && (
									<CheckCircleOutlineIcon />
								)}
							</Button>
						))}
					</div>
					{!window.ethereum && (
						<div>
							<i className="bi bi-exclamation-triangle me-2"></i>
							Please install ethereum agent Metamask
						</div>
					)}
				</Box>
				{error && (
					<Box className="d-block">
						<div className="p-2 text-danger f-80">
							<i className="bi bi-exclamation-triangle text-danger me-2"></i>
							{error.message ||
								"Error occured. visit console for mor info."}
						</div>
					</Box>
				)}
			</Box>
		</Modal>
	);
};

export default NetworkOption;
