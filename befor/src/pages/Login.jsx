import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link, Link as RouterLink, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '100px auto',
  },
  customHeader: {
    fontWeight: 'bold',
    fontSize: '3rem',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxHeight: '80vh',
    width: '30%',
    margin: '50px auto',
    border: '1px solid black',
    borderRadius: '20px',
    padding: theme.spacing(2),
  },
  formElement: {
    margin: theme.spacing(0),
    width: '100%',
  },
  submitButton: {
    margin: theme.spacing(2, 1),
    width: '100%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

function ValidatedTextField({ error, ...props }) {
  return (
    <TextField
      error={error}
      helperText={error ? "필수입력사항입니다." : " "}
      {...props}
    />
  );
}

export default function Login() {
  const classes = useStyles();
  const navigate = useNavigate();
  const auth = getAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const emailError = emailTouched && email === '';
  const passwordError = passwordTouched && password === '';

  const handleChange = (event, setValue, setTouched) => {
    setValue(event.target.value);
    setTouched(true);
  };

  const handleBlur = (event, setTouched) => {
    if (event.target.value === '') {
      setTouched(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        Swal.fire("Success!", "로그인에 성공했습니다.", "success")
        navigate('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/user-not-found') {
          alert('There is no user record corresponding to this identifier.');
        } else if (errorCode === 'auth/invalid-email') {
          alert('The email address is not valid.');
        } else if (errorCode === 'auth/wrong-password') {
          alert('The password is incorrect.');
        } else {
          alert(errorMessage);
        }
      });
  };

  return (
    <div className={classes.container}>
      <Typography variant="h4" component="h1" className={classes.customHeader}>Login</Typography>
      <div className={classes.formContainer}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <ValidatedTextField
            error={emailError}
            helperText={emailError ? "필수입력사항입니다." : " "}
            className={classes.formElement}
            name="email"
            label="Email"
            value={email}
            onChange={(e) => handleChange(e, setEmail, setEmailTouched)}
            onBlur={(e) => handleBlur(e, setEmailTouched)}
          />
          <ValidatedTextField
            error={passwordError}
            helperText={passwordError ? "필수입력사항입니다." : " "}
            className={classes.formElement}
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => handleChange(e, setPassword, setPasswordTouched)}
            onBlur={(e) => handleBlur(e, setPasswordTouched)}
          />
          <Button variant="contained" color="primary" type="submit" className={classes.submitButton}>로그인</Button>
          <Box py={2}>
            <Typography variant="body2" color="textSecondary">
              New Account?{' '}
              <Link component={RouterLink} to="/signup" underline="hover">
                Sign Up
              </Link>
            </Typography>
          </Box>

        </form>
      </div>
    </div>
  );
}
