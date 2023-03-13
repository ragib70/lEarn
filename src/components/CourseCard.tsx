import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { FC } from "react";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import { useNavigate } from "react-router-dom";
import { startCase } from "lodash";

const CourseCard: FC<{
    id: string;
	label: string;
	image: string;
	subscriptionCount: number;
	rating: number;
	level: string;
}> = (props) => {
    const navigate = useNavigate();

	return (
		<Card sx={{ width: '17rem',  height:'100%', '&:hover': {boxShadow: 10}, cursor: 'pointer'}}
            onClick={() => navigate(`${props.id}`)}
        >
			<CardMedia
				component="img"
				alt="green iguana"
				height="140"
				image={props.image}
                sx={{borderBottom: '3px solid whitesmoke'}}
			/>
			<CardContent sx={{paddingTop: '2px'}}>
				<Box display="flex" alignItems='center' paddingBottom={2}>
					<img
						src={`${process.env.PUBLIC_URL}/asset/arrow-stats.svg`}
					/>
					<Typography component="div" alignItems='center' display='flex' ml={1}>
						{props.subscriptionCount > 1000
							? props.subscriptionCount / 1000
							: ""}
						k+ Enrolled
					</Typography>
					<Box padding={1} marginLeft="auto" display='flex' alignItems='center'>
						<StarOutlinedIcon color="warning" />
						{props.rating}
					</Box>
				</Box>
				<Typography  gutterBottom variant="h5" component="div" height='4em'>
					{props.label}
				</Typography>
                <Box display="flex" justifyItems='center'>
					<img
						src={`${process.env.PUBLIC_URL}/asset/bar-chart.svg`}
					/>
					<Typography component="div" alignItems='center' display='flex' ml={1}>
						{startCase(props.level)}
					</Typography>
				</Box>
			</CardContent>
			{/* <CardActions>
				<Button size="small">Share</Button>
				<Button size="small">Learn More</Button>
			</CardActions> */}
		</Card>
	);
};

export default CourseCard;