import { withErrorBoundary } from "components/ErrorBoundary/ErrorBoundary.jsx";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Avatar, Tooltip, styled } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import MuiDrawer from "@mui/material/Drawer";

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	backgroundColor:"primary",
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));


const drawerWidth = 250;
const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	backgroundColor: 'var(--bgbg)', 
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(6.5)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(7.5)} + 1px)`,
	},
	[theme.breakpoints.down("sm")]: {
		width: `0px`,
	},
	backgroundColor: 'var(--btnblue-lil)', 
});
const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	...(open && {
		...openedMixin(theme),
		"& .MuiDrawer-paper": openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}));

const LeftDrawer = ({ isOpened, toggleLeftNav, navOptions }) => {
	return (
		<Drawer
			variant="permanent"
			anchor="left"
			open={isOpened}
			onClose={toggleLeftNav}
		>
			<Tooltip
				title={isOpened ? "Close Left Drawer" : "Open Left Drawer"}
				arrow
			>
				<DrawerHeader>
					<IconButton onClick={toggleLeftNav}>
						{isOpened ? <ChevronLeftIcon /> : 
						<Avatar
									src={`https://integration.beyondchats.com/favicon.png`}
									sx={{paddingLeft:"0.5rem"}}/> 
						}
					</IconButton>
				</DrawerHeader>
			</Tooltip>
			<Divider />
			<List>
				{navOptions.map(({ title, Icon, onClick, isActive }, index) => (
					<Tooltip
						title={isOpened ? "" : title}
						arrow
						placement="right"
						key={title}
					>
						<ListItem
							disablePadding
							sx={{
								display: "block",
								backgroundColor: isActive ? "primary.light" : undefined,
							}}
							className={`nav-option-${index}`}
						>
							<ListItemButton
								onClick={() => {
									toggleLeftNav(false);
									onClick();
								}}
								sx={{
									minHeight: 45,
									justifyContent: isOpened ? "initial" : "center",
									px: 2.5,
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										mr: isOpened ? 3 : "auto",
										justifyContent: "center",
									}}
								>
									<Icon color={isActive ? "primary" : undefined} />
								</ListItemIcon>
								<ListItemText
									primary={title}
									// sx={{ display: isOpened ? "block" : "none" }}
									sx={{ opacity: isOpened ? 1 : 0 }}
								/>
							</ListItemButton>
						</ListItem>
					</Tooltip>
				))}
			</List>
		</Drawer>
	);
};

export default withErrorBoundary(LeftDrawer, "LeftDrawer");

// import React from 'react';
// import Drawer from '@mui/material/Drawer';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'; // Example icon check
// import MenuIcon from '@mui/icons-material/Menu'; // Example icon check
// import Box from '@mui/material/Box';

// // Also, check the icon imports are correct
// import BusinessIcon from '@mui/icons-material/Business';
// import ChatIcon from '@mui/icons-material/Chat';
// import MapIcon from '@mui/icons-material/Map';
// import TeamIcon from '@mui/icons-material/Group';
// import SettingsIcon from '@mui/icons-material/Settings';
// import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
// import Typography from '@mui/material/Typography';


// const drawerWidth = 63;

// const menuItems = [
//   { text: 'Explore Chats', icon: <ChatIcon /> },
//   { text: 'Business Leads', icon: <BusinessIcon /> },
//   { text: 'Mind Map', icon: <MapIcon /> },
//   { text: 'Manage Teams', icon: <TeamIcon /> },
//   { text: 'Configure ChatBot', icon: <SettingsIcon /> },
//   { text: 'Switch ORG', icon: <SwapHorizIcon /> },
// ];

// const LeftDrawer = () => {
//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
// 		width: drawerWidth,
//         flexShrink: 0,
//         '& .MuiDrawer-paper': {
//           width: drawerWidth,
//           boxSizing: 'border-box',
//           top: 65, // Assuming navbar height is 64px
//           height: `calc(100% - 65px)`, 
// 		  backgroundColor:"var(--btnblue-lil)"
//         },
//       }}
//     >
//       <Box
//       sx={{
//         width: 60, 
//         bgcolor: 'primary', 
//         color: 'black',
//         height: '100%', // Full height
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center', 
//       }}
//     >
//       <List sx={{ width: '100%' }}>
//         {menuItems.map((item, index) => (
//           <ListItem key={index} 
// 		  sx={{ 
// 			display: 'flex', 
// 			flexDirection: 'column', 
// 			alignItems: 'center', 
// 			textAlign: 'center',
// 			height:'4rem' }}>
//             <ListItemIcon sx={{ 
// 				display: 'flex', 
// 				flexDirection: 'column', 
// 				alignItems: 'center',  }}>
// 			{item.icon}
// 			</ListItemIcon>
//             {/* <ListItemText 
// 				sx={{ 
// 				display: 'flex', 
// 				flexDirection: 'column', 
// 				alignItems: 'center', 
// 				textAlign: 'center', 
// 				fontSize:'1rem',
// 			}}
// 				primary={item.text} 
// 			/> */}
//           </ListItem>
//         ))}
//       </List>
//     </Box>

//       <Divider />
//     </Drawer>
//   );
// };

// export default LeftDrawer;
