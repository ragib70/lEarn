import {
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	FormControl,
	FormControlLabel,
	FormHelperText,
	FormLabel,
	Modal,
	Radio,
	RadioGroup,
	Typography,
} from "@mui/material";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@emotion/react";
import { tokens } from "../contexts/theme";
import { courses } from "./mycourses";
import QuizIcon from "@mui/icons-material/Quiz";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { UPDATE_QUIZ_SCORE } from "../state/reducer/userData";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { uniqueId } from "lodash";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "25rem",
	borderRadius: 3,
	boxShadow: 24,
};

const QuizPage: FC = () => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const navigate = useNavigate();
	const {path1, path2, path3 } = useParams();
	const dispatch = useDispatch();
	const [resultModal, setResultModal] = useState({
		show: false,
		results: [1, 1],
	});

	const course = useMemo(
		() => courses.find((c) => `${c.id}` === path2),
		[path2]
	);
	const quiz = useMemo(
		() => course.content[parseInt(path3 || "0")].quiz || [],
		[path3, course]
	);
	const defaultValue = useMemo(
		() =>
			quiz.reduce((p: any, c: any, index: number) => {
				p[`answer_${index}`] = c.answer; //c.answer
				return p;
			}, {}),
		[quiz]
	);

	const {
		control,
		handleSubmit,
		reset,
		trigger,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: defaultValue,
	});

	const onSubmit = useCallback(
		(data: any) => {
			const results = Object.entries(data).reduce(
				(p: number[], c: any) => {
					p[0] +=
						quiz[parseInt((c[0] as string).split("_")[1])]
							.answer === c[1]
							? 1
							: 0;
					p[1] += 1;
					return p;
				},
				[0, 0]
			);
            setResultModal({show: true, results})
			dispatch({
				type: UPDATE_QUIZ_SCORE,
				payload: {
					courseId: course.id,
					moduleId: parseInt(path3 || "0"),
					score: { points: results[0], total: results[1] },
				},
			});
		},
		[quiz]
	);

	useEffect(() => {
		reset(defaultValue);
	}, [defaultValue]);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Box m="20px" height="calc(100% - 7em)" position="relative">
				<Box
					position="sticky"
					top="5em"
					sx={{
						backgroundColor: theme.palette.background.default,
						zIndex: 2,
					}}
				>
					<Button
						variant="outlined"
						sx={{
							mb: 2,
							backgroundColor: colors.primary[400],
							color: colors.primary[100],
						}}
						onClick={() => navigate(-1)}
					>
						<ArrowBackIcon />
						Back
					</Button>
					<Box
						display="flex"
						sx={{
							backgroundColor: colors.primary[400],
							padding: 3,
							boxShadow: 2,
						}}
					>
						<Box display="flex">
							<img
								src={`${process.env.PUBLIC_URL}/asset/quiz_icon2.png`}
								width="120px"
								height="120px"
								style={{
									borderRadius: 20,
									backgroundColor: colors.blueAccent[900],
								}}
							/>
							<Box
								display="flex"
								flexDirection="column"
								marginLeft={2}
							>
								<Typography variant="h6">Quiz</Typography>
								<Typography variant="h4">
									{course.label}
								</Typography>
								<Box
									display="flex"
									marginTop="auto"
									alignItems="center"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										fill="currentColor"
										viewBox="0 0 16 16"
									>
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
										<path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10zm0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
										<path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
										<path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
									</svg>
									<Typography fontSize={12} marginLeft={1}>
										79% accuracy
									</Typography>

									<QuizIcon sx={{ marginLeft: 3 }} />
									<Typography fontSize={12} marginLeft={1}>
										{
											quiz.length
										}{" "}
										questions
									</Typography>
								</Box>
							</Box>
						</Box>
						<Box
							display="flex"
							flexDirection="column"
							marginLeft={"auto"}
						>
							<Button
                                type="submit"
								variant="outlined"
								sx={{
									ml: "auto",
									backgroundColor: colors.greenAccent[400],
									color: "white",
									marginTop: "auto",
								}}
							>
								Submit
							</Button>
							{!isValid && (
								<Typography color={colors.redAccent[400]}>
									Please answer all questions
								</Typography>
							)}
						</Box>
					</Box>
				</Box>
				{quiz.map((q: any, index: number) => (
					<Card
						key={`question-${path2}-${path3}-${index}`}
						sx={{
							backgroundColor: colors.primary[400],
							marginTop: 3,
						}}
					>
						<CardContent>
							{q.statement && (
								<>
									{(q.statement as string)
										.split("\n")
										.map((part, index) => (
											<Typography key={uniqueId()}>
												{index === 0 && "Q. "}
												{part}
											</Typography>
										))}
								</>
							)}
							{q.statementImage && (
								<img
									src={`${process.env.PUBLIC_URL}/asset/${q.statementImage}`}
									width="100%"
								/>
							)}
							<Divider sx={{ margin: "40px 0 0 20px" }}>
								answer choices
							</Divider>
							<Controller
								name={`answer_${index}`}
								control={control}
								rules={{ required: true }}
								render={({ field: { value, onChange } }) => (
									<FormControl>
										<RadioGroup
											aria-labelledby="demo-radio-buttons-group-label"
											value={value}
											onChange={(e) => {
												onChange(e);
												trigger(`answer_${index}`);
											}}
										>
											{(q.options as string[]).map(
												(op, index2) => (
													<FormControlLabel
                                                        key={`option-${index}-${index2}`}
														value={op}
														control={<Radio />}
														label={op}
													/>
												)
											)}
										</RadioGroup>
										{errors[`answer_${index}`] && (
											<FormHelperText
												sx={{
													color: colors
														.redAccent[400],
												}}
											>
												Please select any one option.
											</FormHelperText>
										)}
									</FormControl>
								)}
							/>
						</CardContent>
					</Card>
				))}

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
									{resultModal.results[0] ===
									resultModal.results[1]
										? "Congratulations! 🥳"
										: "Your score"}
								</Typography>
								<Divider sx={{ margin: "20px 0 20px 0" }} />
								<Typography
									variant="h6"
									color={colors.grey[100]}
									paddingLeft={1}
								>
									You scored {resultModal.results[0]} points
									out of total {resultModal.results[1]} points
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
						<Box display="flex" marginTop={3} sx={{ px: 4 }}>
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
						</Box>
					</Box>
				</Modal>
			</Box>
		</form>
	);
};

export default QuizPage;
