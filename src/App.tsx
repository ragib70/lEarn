import { ThemeProvider } from "@emotion/react";
import { Box, CssBaseline } from "@mui/material";
import { ProSidebarProvider } from "react-pro-sidebar";
import {
	BrowserRouter,
	Navigate,
	Route,
	Routes,
	useNavigate,
	useParams,
} from "react-router-dom";
import "./App.css";
import AppNavBar from "./components/AppNavBar/AppNavBar";
import AppSideBar from "./components/AppSideBar/AppSideBar";
import AuthProvider, { AuthContext } from "./contexts/auth";
import { ColorModeContext, useMode } from "./contexts/theme";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import Web3 from "web3";
import NetworkProvider, { NetworkContext } from "./contexts/network";
import { useContext, useEffect } from "react";
import CoursesPage from "./pages/courses";
import PageContextProvider from "./contexts/page";
import AppNotification from "./components/AppNotification";
import { Provider } from "react-redux";
import { store } from "./state/store";
import PushChatSupport from "./components/PushChatSupport";
import { useDispatch } from "react-redux";
import { SET_USER_DATA } from "./state/reducer/userData";
import MyCoursesPage from "./pages/mycourses";

export const userData: any[] = require("./userData.json");
export const courses: any[] = require("./courses.json");

function App() {
	const { theme, toggleColorMode } = useMode();
	return (
		<ColorModeContext.Provider value={{ toggleColorMode }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Provider store={store}>
					<ProSidebarProvider>
						<NetworkProvider>
							<AuthProvider>
								<PageContextProvider>
									<BrowserRouter>
										<Routes>
											<Route
												path="/login"
												element={<LoginPage />}
											/>
											<Route
												path="/:path1/*"
												element={
													<div className="app">
														<AppSideBar />
														<Main />
													</div>
												}
											/>
											<Route
												path="*"
												element={
													<Navigate to="/login" />
												}
											/>
										</Routes>
									</BrowserRouter>
									<AppNotification />
								</PageContextProvider>
							</AuthProvider>
						</NetworkProvider>
					</ProSidebarProvider>
				</Provider>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

const Main = () => {
	const { account } = useContext(AuthContext);
	const { contract } = useContext(NetworkContext);
	const navigate = useNavigate();
	const { path1 } = useParams();
	const dispatch = useDispatch();

	useEffect(() => {
		if (!account?.code) {
			navigate("/login");
			return;
		}

		// dispatch({
		//     type: SET_USER_DATA,
		//     payload: userData.find(c => c.account.toLowerCase() === account.code.toLowerCase()) || {}
		// })
	}, [account]);

	useEffect(() => {
		if (contract) {
			contract?.methods
				.getUserData()
				.call({
					from: account?.code,
				})
				.then((res: any) => {
					console.log(res);
					const progressStatus = (
						(res.enrolledCoursesId as number[]) || []
					).reduce((p: any, c) => {
						p[c] = (
							((res.sectionsCompleted || [])[c] as boolean[]) ||
							[]
						).reduce((p: any, c, index) => {
							p[index] = { completed: c };
							return p;
						}, {});

						return p;
					}, {});

                    dispatch({
                        type: SET_USER_DATA,
                        payload: {
                            courses: (res.enrolledCoursesId || []).map((id: string) => parseInt(id)),
                            progressStatus
                        }
                    });
				});
		}
	}, [contract]);

	return (
		<main className="content">
			<AppNavBar search profile />
			{path1 === "app" ? (
				<HomePage />
			) : path1 === "courses" ? (
				<CoursesPage />
			) : path1 === "mycourses" ? (
				<MyCoursesPage />
			) : path1 === "progress" ? (
				<HomePage />
			) : path1 === "more" ? (
				<HomePage />
			) : path1 === "notfound" ? (
				<div>Not found</div>
			) : (
				<Navigate to="/notfound" />
			)}
			<PushChatSupport />
		</main>
	);
};

export default App;
