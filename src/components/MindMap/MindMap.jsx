import { withErrorBoundary } from "components/ErrorBoundary/ErrorBoundary.jsx";
import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import HistoryIcon from "@mui/icons-material/History";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import PaginationItem from "@mui/material/PaginationItem";
import makeStyles from "@mui/styles/makeStyles";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import { Chip, Stack } from "@mui/material";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2/dist/sweetalert2";
import { useMediaQuery, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { useOrgContext } from "context/OrgContext";
import { useApiCall } from "components/common/appHooks.js";
import { usePlanContext } from "context/PlanContext";
import InboxIcon from "@mui/icons-material/Inbox";
import {
	PLANS_LIMIT_REACHED,
	PLAN_UNLIMITED,
} from "components/common/constants";
import { useUserContext } from "context/UserContext";
import { DialogLoader, SmallLoader } from "components/common/NewLoader";
import { fromUnixTime } from "date-fns";
import ReadMoreLess from "components/common/ReadMoreLess";
import mindMapData from "staticData/mindmap.json"
import SearchIcon from '@mui/icons-material/Search'; // Import SearchIcon
import { useResponsiveContext } from "context/ResponsiveContext";
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';



const VectorData = lazy(() => import("./VectorData"));
const CustomNoRowsOverlay = lazy(
	() => import("components/common/CustomNoRowsOverlay")
);
const GroundTruthDialog = lazy(() => import("./GroundTruth/GroundTruthDialog"));
const BucketsDialog = lazy(() => import("./Buckets/BucketsDialog"));
const ViewTrainingStatusDialog = lazy(
	() => import("./ViewTrainingStatusDialog")
);
const AddDataDialog = lazy(() => import("./AddDataDialog"));
const EditDataDialog = lazy(() => import("./EditDataDialog"));


const useStyles = makeStyles((theme) => ({
	// table: {
	// 	maxWidth: 1600,
	// 	"& .MuiTableCell-root": {
	// 	  padding: "14px", // Apply padding to table cells
	// 	},
	// 	"& thead th": {
	// 	  position: "sticky",
	// 	  top: 0,
	// 	  color: "var(--white)",
	// 	  backgroundColor: "var(--primary)",
	// 	  fontWeight: "bold",
	// 	},
	// 	"& tbody tr:nth-child(even)": {
	// 	  backgroundColor: "#FF365C", // Pink background for even rows
	// 	  color: "#FFFFFF", // White text color for better contrast
	// 	},
	//   },
	loading: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100px",
	},
	titleContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
		margin: "1px auto",
		padding: "20px",
		//maxWidth: 1200,
		backgroundColor: "rgba(255, 54, 92, 0.09)"
	},
	pagination: {
		margin: "10px auto",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	tableRow: {
		whiteSpace: "break-spaces",
	},
	action_box: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexWrap: "wrap",
		gap: "0.5rem",
		marginBottom: "0.75rem",
	},
	search_container: {
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "center",marginBottom: "0.25rem",
	},
}));

const MindMap = () => {
	
	const { isMobile } = useResponsiveContext();
	const { Post, Get } = useApiCall();
	const classes = useStyles();
	const {
		user: {  access_token, is_god },
	} = useUserContext();
	const { org } = useOrgContext();
	const { plan } = usePlanContext();
	const theme = useTheme();
	const isSmScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const [data, setData] = useState([]);

	const [openGroundTruthDialog, setOpenGroundTruthDialog] = useState(false);
	const [openBucketsDialog, setOpenBucketsDialog] = useState(false);

	const location = useLocation();
	const { search } = location;
	const query = useMemo(() => new URLSearchParams(search), [search]);
	const page = Number(query.get("page")) || 1;
	const sortBy = Number(query.get("sort_by")) || undefined;
	const order = Number(query.get("order")) || undefined;

	const [count, setCount] = useState(0);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [hasSearched, setHasSearched] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset: resetForm,
	} = useForm({
		defaultValues: {
			q: "",
			numResults: 3,
		},
	});

	// Edit Dialog
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [editData, setEditData] = useState(null);

	// Add Dialog
	const [openAddDialog, setOpenAddDialog] = useState(false);
	// Tasks
	const [openTasksDialog, setOpenTasksDialog] = useState(false);
	const fetchData = async ({ per_page = 10 } = {}) => {
		try {
			setLoading(true);
			// const response = await Get(1, "view_vectors", {
			// 	page,
			// 	per_page,
			// 	sortBy: sortBy || undefined,
			// 	order: order || undefined,
			// });
			setData(mindMapData[page].data.data);
			setTotal(mindMapData[page].data.total);
			setCount(mindMapData[page].data.last_page);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching data:", error);
			setLoading(false);
		}
	};

	async function clearResults() {
		setHasSearched(false);
		resetForm(undefined, { keepDefaultValues: true });
		fetchData();
	}

	async function handleOpenGroundTruthDialog() {
		setOpenGroundTruthDialog(true);
	}
	async function handleOpenBucketsDialog() {
		setOpenBucketsDialog(true);
	}
	async function searchVectors({ q, numResults }) {
		try {
			setLoading(true);
			const response = await Post(1, "search_vectors", {
				q,
				num_results: numResults,
			});
			setData(response.data.data);
			setHasSearched(true);
			setCount(1);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	}

	const columns = useMemo(
		() => [
			{
				field: "data",
				headerName: "Data",
				align: "left",
				headerAlign: "left",
				flex: 1,
				filterable: false,
				renderCell: (params) => (
					<Box sx={{ py: 2, px: 1 }}>
						<ReadMoreLess height={50}>
							{params.row.metadata.text}
							{params.row.metadata.read_more_link ? (
								<>
									{" "}
									<a
										style={{ textDecoration: "underline" }}
										target="_blank"
										href={params.row.metadata.read_more_link}
										rel="noreferrer"
									>
										{params.row.metadata?.read_more_label || "Read More"}
									</a>
								</>
							) : (
								""
							)}
						</ReadMoreLess>
					</Box>
				),
			},
			{
				field: "source",
				headerName: "Source",
				align: "center",
				headerAlign: "center",
				filterable: false,
				renderCell: (params) => {
					try {
						new URL(params.row.metadata.source_url);
						return (
							<Typography
								variant="subtitle2"
								component="a"
								href={params.row.metadata.source_url}
								target="_blank"
								rel="noopener noreferrer"
								style={{ textDecoration: "underline", color: "primary" }}
							>
								Open Link
							</Typography>
						);
					} catch (error) {
						return <Typography variant="subtitle2" sx={{ color: 'black' }}>--</Typography>;
					}
				},
			},
			...(hasSearched
				? [
						{
							field: "score",
							headerName: "Score",
							align: "center",
							headerAlign: "center",
							filterable: true,
							renderCell: (params) => (
								<Typography variant="subtitle2">{params.row.score}</Typography>
							),
						},
					]
				: []),
			{
				field: "type",
				headerName: "Type",
				align: "center",
				headerAlign: "center",
				filterable: true,
				renderCell: (params) => (
					// TODO: Add color for diffrent types
					<Chip
						label={params.row.metadata.source_type}
						variant="outlined"
						color="secondary"
						size="small"
						sx={{
							fontSize: '0.6rem',
							//padding: '3px 5px', // Decreasing padding
							minWidth: '30px' // Optionally decrease the width as well
						  }}
					/>
				),
			},
			{
				field: "created_at",
				headerName: "Created At",
				align: "center",
				headerAlign: "center",
				filterable: true,
				renderCell: (params) => (
					<Typography variant="subtitle2">
						{fromUnixTime(
							params.row?.metadata?.created_at
						).toLocaleDateString()}
					</Typography>
				),
			},
			{
				field: "actions",
				headerName: "Actions",
				align: "center",
				headerAlign: "center",
				filterable: false,
				renderCell: (params) => (
					<>
						<IconButton
							color="secondary"
							onClick={() => handleOpenEditDialog(params.row)}
						>
							<EditIcon />
						</IconButton>
						<IconButton
							color="secondary"
							onClick={() => handleDelete(params.row.vector_id)}
						>
							<DeleteIcon />
						</IconButton>
					</>
				),
			},
		],
		[hasSearched]
	);

	const handleOpenEditDialog = async (data) => {
		setEditData(data);
		// setEditDescription(description);
		setOpenEditDialog(true);
	};

	const handleCloseEditDialog = async () => {
		setOpenEditDialog(false);
		setEditData(null);
	};
	async function handleDelete(id) {
		try {
			const result = await Swal.fire({
				title: "Confirmation",
				text: "Are you sure you want to delete this data?",
				icon: "warning",
				showCancelButton: true,
			});

			if (result.isConfirmed) {
				// Call your delete API endpoint with the necessary parameters
				await Post(1, "delete_vector", { vector_id: id });

				// Update the originally mapped data
				setData((prevData) => prevData.filter((item) => item.vector_id !== id));

				toast.success("Data has been deleted");
			}
		} catch (error) {
			console.error("Error deleting data:", error);
			toast.error("Failed to delete data.");
		}
	}

	const handleOpenAddDialog = async () => {
		if (plan.training !== PLAN_UNLIMITED && total >= plan.training && !is_god) {
			return toast.info(PLANS_LIMIT_REACHED);
		}
		setOpenAddDialog(true);
	};
	const handleOpenTasksDialog = async () => {
		setOpenTasksDialog(true);
	};

	useEffect(() => {
		setData([]);
		// setCount(0);
		fetchData();
		// return addBeyondChat();
	}, [org.host_url, page, order, sortBy]);
	const getRowId = (row) => row.vector_id; // Assuming vector_id is the unique identifier for each row

	return (
		<>
			<div className={classes.titleContainer}>
				<Box className={classes.action_box}>
					<Button
						variant="contained"
						color="secondary"
						startIcon={<AddIcon />}
						onClick={handleOpenAddDialog}
					>
						<Typography variant="h4" component="span" align="center">
							Add Data
						</Typography>
					</Button>
					<Button
						variant="contained"
						color="secondary"
						startIcon={<HistoryIcon />}
						onClick={handleOpenTasksDialog}
					>
						<Typography variant="h4" component="span" align="center">
							Data Training Status
						</Typography>
					</Button>
					<Button
						variant="contained"
						color="secondary"
						startIcon={<QuestionAnswerIcon />}
						onClick={handleOpenGroundTruthDialog}
					>
						<Typography variant="h4" component="span" align="center">
							Ground Truths
						</Typography>
					</Button>
					{is_god ? (
						<Button
							variant="contained"
							color="secondary"
							startIcon={<InboxIcon />}
							onClick={handleOpenBucketsDialog}
						>
							<Typography variant="h6" component="span" align="center">
								Buckets
							</Typography>
						</Button>
					) : null}
				</Box>
				<form
					onSubmit={handleSubmit(searchVectors)}
					className={classes.search_container}
				>
					<TextField
						label="Search"
						variant="outlined"
						error={errors?.q?.type}
						helperText={errors?.q?.message}
						sx={{ mt: 1,
							'& .MuiInputLabel-root': {
							color: "#FF365C", // Pink color for the label
						},
							'& .MuiOutlinedInput-root': {
						  '& fieldset': {
							borderColor: '#FF365C', // Pink border color
						  },
						  '&:hover fieldset': {
							borderColor: '#FF365C', // Pink border color on hover
						  },
						  '&.Mui-focused fieldset': {
							borderColor: '#FF365C', // Pink border color on focus
						  },
						},
						}}
						size="small"
						{...register("q", {
							required: "Required",
						})}
					/>
					<TextField
						select
						label="Results"
						defaultValue={3}
						sx={{ m: 1, minWidth: 120,
							'& .MuiInputLabel-root': {
								color: '#FF365C', // Pink color for the label
							},
							'& .MuiOutlinedInput-root': {
						  '& fieldset': {
							borderColor: '#FF365C', // Pink border color
						  },
						  '&:hover fieldset': {
							borderColor: '#FF365C', // Pink border color on hover
						  },
						  '&.Mui-focused fieldset': {
							borderColor: '#FF365C', // Pink border color on focus
						  },

						}}}
						size="small"
						{...register("numResults")}
					>
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 50].map((value) => (
							<MenuItem key={value} value={value}>
								{value}
							</MenuItem>
						))}
					</TextField>

					{access_token && !isMobile ? (
					<Button type="submit" color="secondary" variant="contained" sx={{ m: 1 }}>
						Search
					</Button>
					) : null}

					{access_token && isMobile ? (
					<Button type="submit" color="secondary" variant="contained" sx={{ m: 1 }}>
						<SearchIcon/>
					</Button>
					) : null}


					{hasSearched ? (
						<Button
							color="secondary"
							variant="outlined"
							sx={{ my: 1 }}
							onClick={clearResults}
						>
							Clear Results
						</Button>
					) : null}
				</form>
			</div>

			<Box sx={{height: "100%" }}>
				{isSmScreen ? (
					loading ? (
						<SmallLoader />
					) : (
						<Suspense fallback={<SmallLoader />}>
							<Box
							sx={{paddingBottom:"0.1px"}}>
								{data.map((item, index) => (
									 <Box
									 key={item.vector_id}
									 sx={{
										 backgroundColor: index % 2 === 0 ? "rgba(50, 173, 230, 0.13)" : "rgba(50, 173, 230, 0.26)", // Pink and Blue
										 //padding: "10px",
										 marginBottom:"0px",
										 marginTrim:"16px",
									 }}
								 >
									 <VectorData
										 data={item}
										 handleOpenEditDialog={handleOpenEditDialog}
										 handleDelete={handleDelete}
									 />
								 </Box>
								))}
							</Box>
							<Box sx={{
								width: '100%',
								position: 'fixed',
								bottom: 0, // Positions the Box at the bottom of the view
								display: 'flex',
								justifyContent: 'space-around', // Spreads the buttons evenly
								backgroundColor: '#ff4d6d', // Reddish background color as shown in your image
								//padding: '10px 0' // Adds some vertical padding
								}}>
								<Button variant="contained" color="secondary" sx={{ width: '50%' }} startIcon={<FilterListIcon />}>Filter</Button>
								<Button variant="contained" color="secondary" sx={{ width: '50%' }} startIcon={<SortIcon />} >Sort</Button>
							</Box>



						</Suspense>
					)
				) : (
					<Box sx={{ width: "100%", minWidth: "960px" }}>
						<DataGrid
							rows={data}
							columns={columns}
							loading={loading}
							autoHeight
							getRowId={getRowId}
							slots={{
								noRowsOverlay: CustomNoRowsOverlay,
							}}
							slotProps={{
								noRowsOverlay: {
									title:
										"Looks like you have not added any data, click on the Add Data Button above",
								},
								loadingOverlay: {
									title: "Loading...",
								},
							}}
							disableSelectionOnClick
							disableRowSelectionOnClick
							hideFooter
							getRowHeight={() => "auto"}
							sx={{
								'& .MuiDataGrid-columnHeaders': {
									backgroundColor: 'rgba(50, 173, 230, 0.26)', 
									fontSize: '1rem',
								},
								'& .MuiDataGrid-row': {
									backgroundColor: (theme) => theme.palette.mode === 'light' ? 'rgba(50, 173, 230, 0.13)' : 'rgba(50, 173, 230, 0.26)', // Pink and Blue color for light and dark modes
									
									'&:nth-of-type(even)': {
										backgroundColor: 'rgba(50, 173, 230, 0.26)', // Blue for even rows
									},
									'&:nth-of-type(odd)': {
										backgroundColor: 'rgba(50, 173, 230, 0.13)', // Pink for odd rows
									},
								},
							}}
						/>
					</Box>
				)}

				<Stack spacing={2} alignItems="center" sx={{ my: isMobile ? 1 : 0, paddingBottom: isMobile ? 5.5 : 0,  }}>
					<Pagination
						page={page}
						count={count}
						sx={{m: "10px auto" }}
						color="secondary"
						renderItem={(item) => {
							const searchParams = new URLSearchParams(location.search);
							searchParams.set("page", item.page);
							return (
								<PaginationItem
									component={Link}
									to={`${location.pathname}?${searchParams.toString()}`}
									{...item}
								/>
							);
						}}
					/>
				</Stack>



			</Box>

			<Suspense fallback={<></>}>
				<AddDataDialog {...{ openAddDialog, setData, setOpenAddDialog }} />
			</Suspense>
			<Suspense fallback={<></>}>
				<ViewTrainingStatusDialog
					{...{ openTasksDialog, setOpenTasksDialog }}
				/>
			</Suspense>
			<Suspense fallback={<DialogLoader />}>
				{openEditDialog && editData ? (
					<EditDataDialog
						{...{
							editData,
							setData,
							openEditDialog,
							setOpenEditDialog,
							handleCloseEditDialog,
						}}
					/>
				) : null}
			</Suspense>
			<Suspense fallback={<DialogLoader />}>
				{openGroundTruthDialog ? (
					<GroundTruthDialog
						{...{
							openGroundTruthDialog,
							setOpenGroundTruthDialog,
						}}
					/>
				) : null}
			</Suspense>
			<Suspense fallback={<DialogLoader />}>
				{openBucketsDialog ? (
					<BucketsDialog
						{...{
							openBucketsDialog,
							setOpenBucketsDialog,
						}}
					/>
				) : null}
			</Suspense>
		</>
	);
};

export default withErrorBoundary(MindMap, "MindMap");
