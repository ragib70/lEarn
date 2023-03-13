import { useTheme } from "@emotion/react";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Avatar,
	Button,
	Card,
	CardContent,
	CardMedia,
	colors,
	Divider,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	NativeSelect,
	Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { height } from "@mui/system";
import { FC, useCallback, useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { tokens } from "../contexts/theme";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import { isEmpty, startCase } from "lodash";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import CodeIcon from "@mui/icons-material/Code";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import VerticalBreak from "../components/VerticalBreak";
import { useSelector } from "react-redux";
import {
	ADD_COURSE,
	UPDATE_LECTURE_STATUS,
	UserData,
} from "../state/reducer/userData";
import { useDispatch } from "react-redux";
import { courses } from "../App";
import { NetworkContext } from "../contexts/network";
import { AuthContext } from "../contexts/auth";
import React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { SET_NOTIF } from "../state/reducer/globalState";

const CourseContent: FC = () => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const { contract } = useContext(NetworkContext);
	const { account } = useContext(AuthContext);
	const { path2 } = useParams();
	const course = useMemo(
		() => courses.find((c) => `${c.id}` === path2),
		[path2]
	);
	const { courses: subscribedCourses, progressStatus } = useSelector(
		(state: any) => state.userData as UserData
	);
	const subscribed = useMemo(
		() => subscribedCourses.findIndex((cid) => cid === course.id) >= 0,
		[subscribedCourses, course]
	);
    const [query, setQuery] = useState({enroll: {loading: false}});

	const [activeAccordianIndex, setActiveAccordianIndex] =
		useState<number>(-1);

	const handleChange = useCallback(
		(expanded: boolean, index: number) => {
			if (expanded) setActiveAccordianIndex(index);
			else if (activeAccordianIndex === index)
				setActiveAccordianIndex(-1);
		},
		[activeAccordianIndex]
	);
	const dispatch = useDispatch();

	return (
		<Box m="20px" height="calc(100% - 7em)" position="relative">
			{isEmpty(course) && (
				<Box padding={2} display="flex" alignItems="center">
					<ErrorOutlineIcon />{" "}
					<span style={{ marginLeft: 5 }}>No courses found.</span>{" "}
				</Box>
			)}
			{course && (
				<>
					<Box
						position="absolute"
						sx={{
							backgroundImage: `linear-gradient(${colors.greenAccent[900]}, ${colors.greenAccent[100]})`,
							height: "300px",
							width: "100%",
							zIndex: -1,
						}}
					></Box>
					<Box justifyContent="space-between" padding="20px">
						<Header
							title={course.label}
							subtitle="Overview and subscribe some of the coolest courses."
						/>
						<Card
							sx={{
								"&:hover": { boxShadow: 10 },
								display: "flex",
							}}
						>
							<CardMedia
								component="img"
								alt="green iguana"
								image={course.thumbnail}
								sx={{ width: "40%", height: 400 }}
							/>
							<CardContent
								sx={{ padding: "20px", width: "100%" }}
							>
								<Box
									display="flex"
									justifyItems="center"
									paddingBottom={2}
								>
									<img
										src={`${process.env.PUBLIC_URL}/asset/arrow-stats.svg`}
									/>
									<Typography
										component="div"
										alignItems="center"
										display="flex"
									>
										{course.subscriptionCount > 1000
											? course.subscriptionCount / 1000
											: ""}
										k+ Enrolled
									</Typography>
									<Box
										padding={1}
										marginLeft="auto"
										display="flex"
										alignItems="center"
									>
										<StarOutlinedIcon color="warning" />
										{course.rating}
									</Box>
								</Box>
								<Typography
									gutterBottom
									variant="h3"
									component="div"
								>
									Course content
								</Typography>
								<Typography gutterBottom>
									{course.description}
								</Typography>
								<Box
									display="flex"
									justifyItems="center"
									my={3}
								>
									<img
										src={`${process.env.PUBLIC_URL}/asset/bar-chart.svg`}
									/>
									<Typography
										component="div"
										alignItems="center"
										display="flex"
										ml={1}
									>
										{startCase(course.difficulty)}
									</Typography>

									<img
										src={`${process.env.PUBLIC_URL}/asset/clock.svg`}
										style={{ marginLeft: "10%" }}
									/>
									<Typography
										component="div"
										alignItems="center"
										display="flex"
										ml={1}
									>
										{course.duration.hour
											? `${course.duration.hour} hours `
											: null}
										{course.duration.minute} minutes
									</Typography>
								</Box>
								<Button
									variant="contained"
									sx={{
										backgroundColor:
											colors.greenAccent[500],
										py: 1,
										px: 3,
										fontSize: 16,
									}}
									disabled={subscribed}
									onClick={() => {
                                        setQuery({...query, enroll: {loading: true}})
										contract?.methods
											.enrollCourse(course.id)
											.send({
												from: account?.code,
												value:
													course.fees ||
													10000000000000000,
											})
											.then((res: any) => {
                                                setQuery({...query, enroll: {loading: false}})
												dispatch({
													type: ADD_COURSE,
													payload: [course.id],
												});
												dispatch({
													type: SET_NOTIF,
													payload: {
														type: "info",
														text: `Enrolled for course ${course.id}`,
													},
												});
											})
											.catch((error: any) => {
                                                setQuery({...query, enroll: {loading: false}})
												dispatch({
													type: SET_NOTIF,
													payload: {
														type: "error",
														text: `Error while case enrollment: ${error.message}`,
													},
												});
											});
									}}
								>
									{subscribed ? "Already enrolled" : "Enroll"}
								</Button>
							</CardContent>
							{/* <CardActions>
				<Button size="small">Share</Button>
				<Button size="small">Learn More</Button>
			</CardActions> */}
						</Card>
						<Box mt={5}>
							{subscribed &&
								(course.content as any[]).map(
									(nextcontent, index) => (
										<Accordion
											key={`content-${index}`}
											expanded={
												activeAccordianIndex === index
											}
											onChange={(e, ex) =>
												handleChange(ex, index)
											}
											sx={{
												backgroundColor:
													colors.primary[400],
											}}
										>
											<AccordionSummary
												expandIcon={<ExpandMoreIcon />}
												id="panel-header-1"
												aria-controls="panel-content-1"
												sx={{
													justifyItems: "center",
													padding:
														"20px 50px 20px 50px",
												}}
											>
												<Box>
													<Typography variant="h5">
														Module {index + 1}
													</Typography>
													<Typography variant="h4">
														{nextcontent.label}
													</Typography>
												</Box>
												<Typography
													ml="auto"
													mr={2}
													py={2}
												>
													<span>
														{
															(
																nextcontent.lectures ||
																[]
															).length
														}{" "}
														Lectures
													</span>
													<VerticalBreak />
													<span>
														{
															(
																nextcontent.lectures ||
																[]
															).reduce(
																(
																	p: any,
																	c: any
																) => {
																	if (
																		c.duration
																	) {
																		let tm =
																			(c
																				.duration
																				.minute ||
																				0) +
																			p
																				.duration
																				.minute;
																		let ts =
																			(c
																				.duration
																				.second ||
																				0) +
																			p
																				.duration
																				.second;

																		tm +=
																			Math.floor(
																				ts /
																					60
																			);
																		ts =
																			ts %
																			60;

																		p = {
																			formatted: `${
																				p
																					.duration
																					.hour +
																				Math.floor(
																					tm /
																						60
																				)
																			} hours ${
																				tm %
																				60
																			} minutes`,
																			duration:
																				{
																					hour:
																						p
																							.duration
																							.hour +
																						Math.floor(
																							tm /
																								60
																						),
																					minute:
																						tm %
																						60,
																					second: ts,
																				},
																		};
																	}
																	return p;
																},
																{
																	formatted:
																		"0 hours",
																	duration: {
																		hour: 0,
																		minute: 0,
																		second: 0,
																	},
																}
															).formatted
														}
													</span>
												</Typography>
											</AccordionSummary>
											<AccordionDetails
												sx={{
													padding: "0 50px 20px 50px",
												}}
											>
												Lorem ipsum dolor sit, amet
												consectetur adipisicing elit.
												Molestiae doloribus molestias
												laudantium dolores illo! Iste
												earum, temporibus cum ad a nemo
												tempore dolor atque neque fugit
												praesentium iure! Ad, corrupti?
												<List
													sx={{
														width: "100%",
														margin: "20px 0 0 0",
														padding: "10px",
														bgcolor:
															colors.primary[900],
														borderRadius: "10px",
													}}
												>
													{(
														nextcontent.lectures ||
														[]
													).map(
														(
															lecture: any,
															index: number
														) => (
															<React.Fragment
																key={`lecture-${nextcontent.id}-${index}`}
															>
																{index > 0 && (
																	<Divider
																		sx={{
																			backgroundColor:
																				colors
																					.primary[400],
																		}}
																	/>
																)}
																<ListItem>
																	<ListItemAvatar>
																		<Avatar>
																			{lecture.type ===
																			"video" ? (
																				<OndemandVideoIcon />
																			) : lecture.type ===
																			  "problem" ? (
																				<CodeIcon />
																			) : (
																				<LibraryBooksIcon />
																			)}
																		</Avatar>
																	</ListItemAvatar>
																	<ListItemText
																		primary={
																			lecture.label
																		}
																		secondary={`${
																			lecture
																				.duration
																				?.hour ||
																			0
																		} hours ${
																			lecture
																				.duration
																				?.minute ||
																			0
																		} minutes`}
																	/>
																	<Box ml="auto">
																		<LectureStatus
																			value={
																				(
																					((progressStatus[
																						course
																							.id
																					] ||
																						{})[
																						nextcontent
																							.id
																					] ||
																						{})[
																						lecture
																							.id
																					] ||
																					{}
																				)
																					.status ||
																				"not_yet_started"
																			}
																			onChange={(
																				value
																			) => {
																				dispatch(
																					{
																						type: UPDATE_LECTURE_STATUS,
																						payload:
																							{
																								courseId:
																									course.id,
																								moduleId:
																									nextcontent.id,
																								lectureId:
																									lecture.id,
																								status: value,
																							},
																					}
																				);
																			}}
																		/>
																	</Box>
																</ListItem>
															</React.Fragment>
														)
													)}
												</List>
												<Box display="flex" mt={3}>
													<Button
														variant="contained"
														sx={{
															backgroundColor:
																colors
																	.greenAccent[400],
															marginLeft: "auto",
														}}
														disabled={
															(
																nextcontent.lectures ||
																[]
															).reduce(
																(
																	p: number,
																	c: any
																) => {
																	return (
																		p +
																		(((
																			((progressStatus[
																				course
																					.id
																			] ||
																				{})[
																				nextcontent
																					.id
																			] ||
																				{})[
																				c
																					.id
																			] ||
																			{}
																		)
																			.status ||
																			"not_yet_started") ===
																		"completed"
																			? 1
																			: 0)
																	);
																},
																0
															) !==
															(
																nextcontent.lectures ||
																[]
															).length
														}
													>
														Complete
													</Button>
												</Box>
											</AccordionDetails>
										</Accordion>
									)
								)}

							{!subscribed && (
								<Box
									padding={2}
									display="flex"
									alignItems="center"
								>
									<ErrorOutlineIcon />{" "}
									<span style={{ marginLeft: 5 }}>
										Please subscribe to the course to view content.
									</span>{" "}
								</Box>
							)}
						</Box>
					</Box>
				</>
			)}
		</Box>
	);
};

export default CourseContent;

const LectureStatus: FC<{
	value: string;
	onChange?: (value: string) => void;
}> = ({ value, onChange }) => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);

	return (
		<NativeSelect
			defaultValue={value}
			// inputProps={{
			// 	name: "age",
			// 	id: "uncontrolled-native",
			// }}
			onChange={(e) => {
				if (onChange) onChange(e.target.value);
			}}
			sx={{
				backgroundColor: colors.primary[400],
				px: 1,
				width: 140,
				// backgroundColor:
				// 	value === "completed"
				// 		? "lightgreen"
				// 		: value === "in_progress"
				// 		? colors.primary[300]
				// 		: "orangered",
				// padding: "5px 10px 5px 10px",
				// borderRadius: "10px",
				// color: "white",
			}}
		>
			<option value={"not_yet_started"}>Not Yet Started</option>
			<option value={"in_progress"}>In Progres</option>
			<option value={"completed"}>Completed</option>
		</NativeSelect>
		// <span
		// 	className="text-cut"
		// 	style={{
		// 		backgroundColor:
		// 			value === "completed"
		// 				? "lightgreen"
		// 				: value === "in_progress"
		// 				? colors.primary[300]
		// 				: "orangered",
		// 		padding: "5px 10px 5px 10px",
		// 		borderRadius: "10px",
		// 		color: "white",
		// 	}}
		// >
		// 	{startCase(value)}
		// </span>
	);
};
