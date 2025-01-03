'use client' 
 //ismile
import './login3.scss'
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import handleLogin from '../auth';


const Login3 = () => {

    return (
        <div>
            <div style={{ margin: '0px' }}>
                <canvas width="1366" height="641"></canvas>
                <div className="login-form">
                    <form method="post" autoComplete="off" onSubmit={handleLogin}>
                        <p style={{ textAlign: 'center' }}>
                            <a href="https://atik.urbanitsolution.com/" className="text-center">
                                {/* <Image
                                    src="https://atik.urbanitsolution.com/files/logo/thumbnail/7632b474c6d5b78e3f6233a87461bf623f453c67.jpeg"
                                    alt="logo"
                                    width={'80'}
                                    height={'80'}
                                    style={{ width: '80px' }}
                                /> */}
                                 <img src="https://atik.urbanitsolution.com/files/logo/thumbnail/7632b474c6d5b78e3f6233a87461bf623f453c67.jpeg" alt="logo" />
                            </a>
                        </p>

                        <h2 className="font-weight-bold" style={{ textAlign: 'center' }}>
                        Inventory Software
                        </h2>
                        <h5 className="text-dark" style={{ textAlign: 'center', margin: '0px' }}>
                            <span>Inventory</span>
                        </h5>
                        <p className="text-center text-dark"><small>
                            Dear user, log in to access the admin area!</small></p>
                        <div className="form-group log-status">
                            <input
                                type="email"
                                className="form-controls"
                                name="email"
                                placeholder="Enter Email Address"
                                required
                            />
                            <i className="fa fa-user"></i>
                        </div>
                        <div className="form-group log-status">
                            <input
                                type="password"
                                className="form-controls"
                                name="password"
                                placeholder="Enter Password"
                                required
                            />
                            <i className="fa fa-lock"></i>
                        </div>
                        <input type="submit" name="login" className="log-btn" value="Log In" />
                    </form>
                </div>

                <Script src="https://api.urbanitsolution.com/web_content/login/3/js/main.js"></Script>
                <Script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></Script>
                <Script src="https://api.urbanitsolution.com/web_content/login/3/js/index.js"></Script>
            </div>
            <Toaster />
        </div>
    );
};

export default Login3;
