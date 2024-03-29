import { useTheme } from "@emotion/react";
import { Box, Button } from "@mui/material";
import { FC, useContext, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { NetworkContext } from "../contexts/network";
import { tokens } from "../contexts/theme";
import { SET_NOTIF } from "../state/reducer/globalState";

const FuelTest: FC = () => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const [counter, setCounter] = useState<any>(0);
	const { contract } = useContext(NetworkContext);
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	return (
		<Box>
			Count: <span style={{ margin: "0 10px 0 10px" }}>{counter? counter.words[0]: 0}</span>
			<Button
				variant="contained"
				color="success"
				onClick={() => {
					setLoading(true);
                    console.log(contract)
					contract.functions
						.increment()
						.txParams({ gasPrice: 1 })
						.call()
						.then(() => {
							contract.functions
								.count()
								.get()
								.then((res: any) => {
                                    console.log(res)
									setCounter(res.value);
									setLoading(false);
								});
						})
						.catch((err: any) => {
							console.log(err);
							dispatch({
								type: SET_NOTIF,
								payload: {
									type: "error",
									text: `Error in fuel contract. ${err.message}`,
								},
							});
							setLoading(false);
						});
				}}
				disabled={loading}
			>
				{loading ? (
					<Box display='flex' justifyItems='center'>
						{/* <img
							src={`${process.env.PUBLIC_URL}/asset/spinner1.svg`}
							width="16px"
							height="16px"
                            style={{margin: '2px 5px 0 0'}}
						/> */}
						<svg
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
                            height={16}
                            width={16}
							style={{margin: '2px 5px 0 0'}}
						>
							<circle
								cx="8"
								cy="8"
								r="6.4"
								className="bg"
							></circle>
							{/* <circle
								cx="8"
								cy="8"
								r="6.4"
								className="animated"
							></circle> */}
						</svg>
						Loading...
					</Box>
				) : (
					"Increment"
				)}
			</Button>
		</Box>
	);
};

export default FuelTest;
