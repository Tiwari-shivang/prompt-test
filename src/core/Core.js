import React, { Component, Suspense } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import {
	QueryClient,
	QueryClientProvider
} from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { RecoilRoot } from "recoil";
import { CookiesProvider } from 'react-cookie';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../components/common.scss';
import ErrorBoundary from '../core/ErrorBoundary';
import { ReactQueryDevtools } from 'react-query/devtools'
import Error from '../views/authScreen/Error';
// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		}
	}
})

const loading = (
	<div className="pt-3 text-center">
		<div className="sk-spinner sk-spinner-pulse"></div>
	</div>
)


const Login = React.lazy(() => import('../views/authScreen/Login'))
const OTPVerify = React.lazy(() => import('../views/authScreen/OtpVerify'))
const UpdatePhoneNumber = React.lazy(() => import('../views/authScreen/UpdatePhoneNumber'))
const QRCode = React.lazy(() => import('../views/authScreen/QrCode'))
const ForgotPassword = React.lazy(() => import('../views/authScreen/ForgotPassword'))
const ConfirmPassword = React.lazy(() => import('../views/authScreen/ConfirmPassword'))
const DefaultLayout = React.lazy(() => import('../layout/DefaultLayout'))

// Pages
class Core extends Component {

	render() {
		return (
			// Provide the client to your App
			<QueryClientProvider client={queryClient}>
				<ErrorBoundary>
					<RecoilRoot>
						<CookiesProvider>
							<BrowserRouter>
								<Suspense fallback={loading}>
									<Routes>
										<Route exact path="/" name="Login Page" element={<Login />} />
										<Route exact path="/login" name="Login Page" element={<Login />} />
										<Route exact path="/login/qrCode" name="QR Code" element={<QRCode />} />
										<Route exact path="/login/otpVerify" name="OTP Verify" element={<OTPVerify />} />
										<Route exact path="/login/changePhoneNumber" name="Change Phone Number" element={<UpdatePhoneNumber />} />
										<Route exact path="/forgotPassword" name="Forgot Password Page" element={<ForgotPassword />} />
										<Route exact path="/employeeNotFound" name="Error" element={<Error />} />
										<Route exact path="confirmPassword" name="Confirm Password Page" element={<ConfirmPassword />} />
										<Route path="*" name="Home" element={<DefaultLayout />} />
									</Routes>
								</Suspense>
							</BrowserRouter>
						</CookiesProvider>
					</RecoilRoot>
				</ErrorBoundary>
				<ToastContainer />
				{/* <ReactQueryDevtools initialIsOpen={false} position='bottom-right' /> */}
			</QueryClientProvider>
		)
	}
}

export default Core
