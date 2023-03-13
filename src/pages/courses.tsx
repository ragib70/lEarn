import { useTheme } from "@emotion/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { isEmpty } from "lodash";
import { FC, useContext, useMemo } from "react";
import { Route, Routes } from "react-router-dom";
import { courses } from "../App";
import CourseCard from "../components/CourseCard";
import Header from "../components/Header";
import { PageContext } from "../contexts/page";
import { tokens } from "../contexts/theme";
import CourseContent from "./courseContent";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const CoursesPage: FC = () => {
	return (
		<Routes>
			<Route path=":path2" element={<CourseContent />} />
			<Route path="" element={<Base />} />
		</Routes>
	);
};

const Base: FC = () => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const { searchText } = useContext(PageContext);

	const filteredCourses = useMemo(
		() =>
			courses.filter((c) =>
				((c.label as string) || "")
					.toLowerCase()
					.includes(searchText.toLowerCase())
			),
		[searchText]
	);
	return (
		<Box m="20px" height="calc(100% - 7em)">
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
			>
				<Header
					title="COURSES"
					subtitle="Overview and subscribe some of the coolest courses."
				/>
			</Box>
			<Grid
				container
				spacing={2}
				margin={0}
				width="100%"
				padding="0 0 16px 0"
				sx={{ backgroundColor: colors.primary[400] }}
			>
				{filteredCourses.map((course, index) => (
					<Grid key={`course-${index}`} item>
						<CourseCard
							id={course.id}
							label={course.label}
							image={course.thumbnail}
							subscriptionCount={course.subscriptionCount}
							rating={course.rating}
							level={course.difficulty}
						/>
					</Grid>
				))}
                {isEmpty(filteredCourses) && (
					<Box padding={2} display="flex" alignItems="center">
						<ErrorOutlineIcon /> <span style={{marginLeft: 5}}>No courses found.</span>{" "}
					</Box>
				)}
			</Grid>
		</Box>
	);
};

export default CoursesPage;
