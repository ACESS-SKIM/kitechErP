import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, Grid, FormHelperText, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { db } from '../api/firebase';  // Firestore setup file
import { Link, Link as RouterLink, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
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
    maxHeight: '80vh',  // 브라우저의 높이 제한
    width: '30%',
    margin: '50px auto',
    border: '1px solid black',
    borderRadius: '20px',
    padding: theme.spacing(2),  // 폼 내부 패딩 추가
  },
  //입력폼
  formElement: {
    margin: theme.spacing(0),
    width: '100%',
  },
  // 드롭박스
  formControl: {
    margin: theme.spacing(0),
    minWidth: '100%',
  },
  submitButton: {
    margin: theme.spacing(2, 1),
    width: '100%',
  },
  // 전체폼
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

export default function SignUp() {
  const classes = useStyles();
  const navigate = useNavigate();
  const auth = getAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState('');
  const [contact, setContact] = useState('');
  const [authority, setAuthority] = useState('');

  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [companyTouched, setCompanyTouched] = useState(false);
  const [departmentTouched, setDepartmentTouched] = useState(false);
  const [contactTouched, setContactTouched] = useState(false);
  const [authorityTouched, setAuthorityTouched] = useState(false);

  const nameError = nameTouched && name === '';
  const emailError = emailTouched && email === '';
  const passwordError = passwordTouched && password === '';
  const confirmError = confirmTouched && confirm === '';
  const companyError = companyTouched && company === '';
  const departmentError = departmentTouched && department === '';
  const contactError = contactTouched && contact === '';
  const authorityError = authorityTouched && authority === '';

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
    const user = {
      name: name,
      email: email,
      password: password,
      confirm: confirm,
      company: company,
      department: department,
      contact: contact,
      authority: authority,
    };
    // Password check and validation should be here
    createUserWithEmailAndPassword(auth, user.email, user.password)
      .then((userCredential) => {
        // Signed in 
        const uid = userCredential.user.uid;
        const userData = { ...user };
        delete userData.password;
        delete userData.confirm;
        setDoc(doc(db, "users", uid), userData);
        Swal.fire("Submitted!", "회원가입 신청이 완료되었습니다.", "success")
        navigate('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/email-already-in-use') {
          alert('The email address is already in use by another account.');
        } else if (errorCode === 'auth/invalid-email') {
          alert('The email address is not valid.');
        } else if (errorCode === 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
      });
  };

  return (
    <div className={classes.container}>
      <Typography variant="h4" component="h1" className={classes.customHeader}>Sign Up</Typography>
      <div className={classes.formContainer}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container direction="column" className={classes.formElement}>
            <ValidatedTextField
              error={nameError}
              helperText={nameError ? "필수입력사항입니다." : " "}
              name="name"
              label="Name"
              value={name}
              onChange={(e) => handleChange(e, setName, setNameTouched)}
              onBlur={(e) => handleBlur(e, setNameTouched)}
            />
          </Grid>
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
          <ValidatedTextField
            error={confirmError}
            helperText={confirmError ? "필수입력사항입니다." : " "}
            className={classes.formElement}
            name="confirm"
            label="Confirm Password"
            type="password"
            value={confirm}
            onChange={(e) => handleChange(e, setConfirm, setConfirmTouched)}
            onBlur={(e) => handleBlur(e, setConfirmTouched)}
          />
          <ValidatedTextField
            error={companyError}
            helperText={companyError ? "필수입력사항입니다." : " "}
            className={classes.formElement}
            name="company"
            label="Company"
            value={company}
            onChange={(e) => handleChange(e, setCompany, setCompanyTouched)}
            onBlur={(e) => handleBlur(e, setCompanyTouched)}
          />
          <ValidatedTextField
            error={departmentError}
            helperText={departmentError ? "필수입력사항입니다." : " "}
            className={classes.formElement}
            name="department"
            label="Department"
            value={department}
            onChange={(e) => handleChange(e, setDepartment, setDepartmentTouched)}
            onBlur={(e) => handleBlur(e, setDepartmentTouched)}
          />
          <ValidatedTextField
            error={contactError}
            helperText={contactError ? "필수입력사항입니다." : " "}
            className={classes.formElement}
            name="contact"
            label="Contact"
            value={contact}
            onChange={(e) => handleChange(e, setContact, setContactTouched)}
            onBlur={(e) => handleBlur(e, setContactTouched)}
          />
          <FormControl className={classes.formControl} error={authorityError}>
            <InputLabel id="authority-label">Authority</InputLabel>
            <Select
              labelId="authority-label"
              id="authority"
              name="authority"
              value={authority}
              onChange={(e) => handleChange(e, setAuthority, setAuthorityTouched)}
              onBlur={(e) => handleBlur(e, setAuthorityTouched)}
            >
              <MenuItem value="">
                <em>Select Option</em>
              </MenuItem>
              <MenuItem value={"제품제조사"}>제품제조사</MenuItem>
              <MenuItem value={"부품공급사"}>부품공급사</MenuItem>
            </Select>
            <FormHelperText>{authorityError ? "필수입력사항입니다." : " "}</FormHelperText>
          </FormControl>
          <Button variant="contained" color="primary" type="submit" className={classes.submitButton}>가입</Button>
          <Box py={2}>
            <Typography variant="body2" color="textSecondary">
              Already Account?{' '}
              <Link component={RouterLink} to="/login" underline="hover">
                Log In
              </Link>
            </Typography>
          </Box>
        </form>
      </div>
    </div>
  );
}
