import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { toast, Toaster } from "react-hot-toast";
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

const RegisterScreen = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  // const [loading,setLoading] = useState("");
  const [sendOTPloading, setSendOTPloading] = useState(false);
  const [sendVerifyOTPloading, setSendVerifyOTPloading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const [isVButtonDisabled, setVButtonDisabled] = useState(false);


 
  const [register, { isLoading }] = useRegisterMutation();
 

  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        }
      );
    }
  }

  // Use useEffect to monitor changes to the phone number value
  useEffect(() => {
    // Enable the button if the phone number is not null or empty
    if (ph && ph.trim() !== '' && ph.length===12) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [ph]); // Run this effect whenever the 'ph' state changes

  function onSignup() {
    setSendOTPloading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setSendOTPloading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
        setSendOTPloading(false);
      });
  }


  const sendOTP = async() => {
    try{
      
      // console.log(ph+'name '+name)
      if (ph && name) {
        // Disable the button
        setButtonDisabled(true);
    
        // Set a timeout to re-enable the button after 5 minutes
        setTimeout(() => {
          setButtonDisabled(false);
        }, 300000); // 5 minutes in milliseconds
      }
      
    //  console.log('sendOTP name'+name +'ph'+ph );
    // console.log('ph'+ph )
    // const res = await register({ name:'test', phoneNo:ph, password:'test' }).unwrap();
  
 
 
    setSendOTPloading(true);
    onCaptchVerify();
    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setSendOTPloading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
        setSendOTPloading(false);
      });
        //  setSendOTPloading(false);
        // setShowOTP(true);
        // toast.success("OTP sent successfully!");
    }
    catch(err){
      toast.error(err?.data?.message || err.error);
    }
  };
  

  const verifyOTP = async() => {
    setSendVerifyOTPloading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        setUser(res.user);
        setSendVerifyOTPloading(false);
    setVButtonDisabled(true);
      })
      .catch((err) => {
        console.log(err);
        setSendVerifyOTPloading(false);
    setVButtonDisabled(false);
      });
      
     
  };

  

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
 
        const res = await register({ name, phoneNo:ph.slice(2), password }).unwrap();
        // console.log('res'+res )
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <section className="bg-emerald-500 flex items-center justify-center h-screen">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        <FormContainer>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId='phone'>
              <Form.Label>Phone Number</Form.Label>
              <PhoneInput 
              isValid={(value, country) => {
                if (value.match(/12345/)) {
                  return 'Invalid value: '+value+', '+country.name;
                } else if (value.match(/1234/)) {
                  return false;
                } else {
                  return true;
                }
              }}
              disableDropdown="true" country={"in"} value={ph}  onChange={(value) => setPh(value)}    />
            </Form.Group>
            <Button
              onClick={sendOTP}
              variant='outline-success'
              className="flex gap-1 items-center justify-center py-2.5 my-2 rounded"
              disabled={isButtonDisabled}
            >
              {sendOTPloading && (
                <CgSpinner size={20} className="mt-1 animate-spin" />
              )}
              <span>Send OTP via SMS</span>
            </Button>

            {showOTP && (
              <>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container "
                />
                <Button
                  onClick={verifyOTP}
                  variant='outline-success'
                  className="flex gap-1 items-center justify-center py-2.5 my-2 rounded"
                  disabled={isVButtonDisabled}
                >
                  {sendVerifyOTPloading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Verify OTP</span>
                </Button>
                {user ? (
                  <>
                    <Form.Group controlId='password'>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId='confirmPassword'>
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type='password'
                        placeholder='Confirm password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Form.Group>
                    <Button
                      disabled={isLoading}
                      variant='primary'
                      type='submit'
                      className="my-2"
                    >
                      Register
                    </Button>
                  </>
                ) : (<h6>Enter OTP and click on verify OTP button  </h6>)}
              </>
            )}
            {isLoading && <Loader />}
          </Form>

          <Row className='py-3'>
            <Col>
              Already have an account?{' '}
              <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                Login
              </Link>
            </Col>
          </Row>
        </FormContainer>
      </div>
    </section>
  );
};

export default RegisterScreen;
