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
import FuelTest from "./components/FuelTest";

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
	const { contract, wallet, setContract, setWallet } = useContext(NetworkContext);
	const navigate = useNavigate();
	const { path1 } = useParams();
	const dispatch = useDispatch();

	useEffect(() => {
		if (!account?.code) {
            setContract(undefined);
            setWallet(undefined);
			navigate("/login");
			return;
		}
	}, [account]);

	useEffect(() => {
        if (!wallet || wallet.provider === 'fuel') return;
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
					).reduce((p: any, c, index) => {
						p[c] = (
							((res.sectionsCompleted || [])[index] as boolean[]) ||
							[]
						).reduce((p: any, c2, index) => {
                            const lectureStatus = ((courses[c] || {}).content || []).reduce((p: any, c3: any) => {
                                p[c3.id] = {status: c2 ? 'completed' : 'not_yet_started'}
                                return p
                            } , {})
							p[index] = { completed: c2, ...lectureStatus};
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
	}, [contract, wallet]);

	return (
		<main className="content">
			<AppNavBar search profile />
            {
                wallet?.provider === 'metamask' && <>
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
                </>
            }
            {
                wallet?.provider === 'fuel' && 
                <FuelTest />
            }
			
		</main>
	);
};

export default App;
