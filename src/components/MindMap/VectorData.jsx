import React from "react";
import ReadMoreLess from "components/common/ReadMoreLess";
import { Box, IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Delete, Edit } from "@mui/icons-material";
import { fromUnixTime } from "date-fns";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		padding: "0.86rem",
		borderRadius: "5px",
		boxShadow: "0 0 0.15rem 0 rgba(224, 224, 224, 0.5)",
		outline: "0.1rem solid rgba(224, 224, 224, 0.5)",
		marginBottom: "0",
	},

	source_type_container: {
		display: "flex",
		width: "100%",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	source_type: {
		fontSize: "0.6rem",
		color: "secondary",
		fontWeight: "bold",
		textTransform: "uppercase",
		padding: "0.2rem 0.5rem",
		borderRadius: "0.5rem",
		backgroundColor: "rgba(255, 255, 255, 0.45)",
		marginLeft:"-0.5rem"
	},
	footer_container: {
		display: "flex",
		width: "100%",
		justifyContent: "space-between",
		alignItems: "center",
		//marginTop: "0.7rem",
	},
	details_container: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "flex-start",
		gap: "0.25rem",
	},
	source_link: {
		color: "#32ADE6",
		textDecoration: "underline",
	},
	actions_container: {
		display: "flex",
		justifyContent: "flex-end",
		alignItems: "center",
		// gap: "0.5rem",
	},
}));

const VectorData = ({ data, handleOpenEditDialog, handleDelete }) => {
	const classes = useStyles();
	return (
		<Box className={classes.root}>
			<ReadMoreLess height={48}>{data?.metadata?.text}</ReadMoreLess>
			{/* <Box className={classes.source_type_container}>
				<Typography
					variant="caption"
					color="secondary"
					className={classes.source_type}
				>
					{data?.metadata?.source_type ?? "Unknown Source"}
				</Typography>
			</Box> */}

			<Box className={classes.footer_container}>
				<Box className={classes.details_container}>
					<Typography variant="caption" color="#32ADE6">
						<a
							href={data?.metadata?.source_url ?? "#"}
							target="_blank"
							rel="noreferrer"
							className={classes.source_link}
						>
							View Source
						</a>
					</Typography>
					{/* <Typography variant="subtitle1" color="textSecondary">
						{new Intl.RelativeTimeFormat("en", {
							numeric: "auto",
						}).format(-new Date(data?.metadata?.created_at), "days")}
					</Typography> */}
					<Typography variant="subtitle2">
						{fromUnixTime(
							data?.metadata?.created_at
						).toLocaleDateString()}
					</Typography>
				</Box>

				<Box className={classes.actions_container}>
					<IconButton size="medium" onClick={() => handleOpenEditDialog(data)}>
						<Edit color="secondary" fontSize="small" />
					</IconButton>
					<IconButton
						size="medium"
						onClick={() => handleDelete(data?.vector_id)}
					>
						<Delete color="error" fontSize="small" />
					</IconButton>
				</Box>
			</Box>
		</Box>
	);
};

export default VectorData;
