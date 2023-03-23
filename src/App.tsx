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
import { useContext, useEffect, useState } from "react";
import CoursesPage from "./pages/courses";
import PageContextProvider, { PageContext } from "./contexts/page";
import AppNotification from "./components/AppNotification";
import { Provider } from "react-redux";
import { store } from "./state/store";
import PushChatSupport from "./components/PushChatSupport";
import { useDispatch } from "react-redux";
import { SET_USER_DATA } from "./state/reducer/userData";
import MyCoursesPage from "./pages/mycourses";
import FuelTest from "./components/FuelTest";
import { SET_LOADING, SET_NOTIF } from "./state/reducer/globalState";
import OverlayLoader from "./components/OverlayLoader";
import { transformFuelResponse, transformMetamaskResponse } from "./methods/transformer";

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
                                    <OverlayLoader />
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
	const { contract, wallet, setContract, setWallet } =
		useContext(NetworkContext);
	const navigate = useNavigate();
	const { path1 } = useParams();
	const dispatch = useDispatch();
    const {userDataQuery, setUserDataQuery} = useContext(PageContext);

	useEffect(() => {
		if (!account?.code) {
			setContract(undefined);
			setWallet(undefined);
            dispatch({
                type: SET_USER_DATA,
                payload: {
                    courses: [],
                    progressStatus: {}
                }
            })
			navigate("/login");
			return;
		}
	}, [account]);

    useEffect(() => {
        if (userDataQuery.loading){
            dispatch({
                type: SET_LOADING,
                payload: {
                    loading: true
                }
            })
        }else{
            dispatch({
                type: SET_LOADING,
                payload: {
                    loading: false
                }
            })
        }
    }, [userDataQuery])

    const onUserDataCallFailure = (error: any) => {
        dispatch({
            type: SET_NOTIF,
            payload: {
                type: 'error',
                text: error.message
            }
        })
        setUserDataQuery({loading: false});
    }
	useEffect(() => {
        dispatch({
            type: SET_USER_DATA,
            payload: {
                courses: [],
                progressStatus: {}
            },
        });
		if (wallet?.provider === "fuel" && contract && !userDataQuery.loading) {
            setUserDataQuery({loading: true});
			contract.functions
				.get_user_data()
				.txParams({ gasPrice: 1 })
				.call()
				.then((res: any) => {
                    // console.log(res);
                    dispatch({
						type: SET_USER_DATA,
						payload: {
							...transformFuelResponse(res.value)
						},
					});
                    dispatch({
                        type: SET_NOTIF,
                        payload: {
                            type: 'info',
                            text: "User data loaded"
                        }
                    })
                    setUserDataQuery({loading: false});
                })
                .catch(onUserDataCallFailure);
		} else if (wallet?.provider === "metamask" && contract) {
            setUserDataQuery({loading: true});
			contract?.methods
				.getUserData()
				.call({
					from: account?.code,
				})
				.then((res: any) => {
					dispatch({
						type: SET_USER_DATA,
						payload: {
							...transformMetamaskResponse(res)
						},
					});
                    dispatch({
                        type: SET_NOTIF,
                        payload: {
                            type: 'info',
                            text: "User data loaded"
                        }
                    })
                    setUserDataQuery({loading: false});
				})
                .catch(onUserDataCallFailure);
		}
	}, [contract, wallet]);

	return (
		<main className="content">
			<AppNavBar search profile />
			{(
				<>
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
			)}
			{/* {wallet?.provider === "fuel" && <FuelTest />} */}
		</main>
	);
};

export default App;
