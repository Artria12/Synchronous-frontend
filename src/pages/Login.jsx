import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { VisuallyHiddenInput } from '../component/styles/StyledComponents'
import {CameraAlt as CameraAltIcon, Fullscreen, FullscreenExitOutlined} from '@mui/icons-material'
import {useFileHandler, useInputValidation,useStrongPassword} from '6pp'
import { usernameValidator } from '../utils/validators'
import { bgGradient } from '../constants/color'
import { server } from '../constants/config'
import { useDispatch } from 'react-redux'
import toast from "react-hot-toast";
import axios from 'axios'
import { userExists } from '../redux/reducers/auth'

function Login() {
    const [isLogin,SetisLogin]=useState(true)
       const [isLoading, setIsLoading] = useState(false);

    const toggleLogin=()=>{
         SetisLogin(!isLogin)
    }
    const dispatch = useDispatch();
    const HandleLogin=async(e)=>{
         setIsLoading(true)
        e.preventDefault();
       const toastId = toast.loading("Logging In...");
          const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
     try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      ); 
          console.log("login",data)
           dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
      console.log("data login",data)
     } catch (error) {
       console.log(error);
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
     }
     finally{
         setIsLoading(false)
     }
    }
     const HandleSignUp=async (e)=>{
        e.preventDefault();
        setIsLoading(true)
         const toastId = toast.loading("Signing Up...");
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );

      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    }
    finally{
      setIsLoading(false)
    } 
    }
    const name=useInputValidation("");
    const bio=useInputValidation("");
    const username=useInputValidation("",usernameValidator);
    const password=useInputValidation("");
    const avatar=useFileHandler("single")
  return (
    <div 
    style={{
        
        backgroundImage: bgGradient,
      }}>
     <Container
        component={"main"}
        maxWidth="xs"
         sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
        {
            isLogin?
           (
            <>
              <Typography variant="h5">Login</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={HandleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />

                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />

                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                >
                  Login
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>

                <Button
                  disabled={isLoading}
                  fullWidth
                  variant="text"
                  onClick={toggleLogin}
                >
                  Sign Up Instead
                </Button>
              </form>
            </>
          ) 
          
             :
              (
            <>
              <Typography variant="h5">Sign Up</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                 onSubmit={HandleSignUp}
              >
                 <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                   src={avatar.preview}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
                      ":hover": {
                        bgcolor: "rgba(0,0,0,0.7)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAltIcon />
                       <VisuallyHiddenInput type='file' accept="image/*" onChange={avatar.changeHandler}/>
                    </>
                  </IconButton>
                </Stack>
                    {avatar.error && (
                  <Typography  m={"1rem auto"} width={"fit-content"} color={"error"} display={"block"} variant={"caption"}>
                    {avatar.error}
                  </Typography>
                )}
                <TextField
                 required
                 fullWidth
                  label="Name"
                  margin="normal"
                  value={name.value}
                  onChange={name.changeHandler}
                  variant="outlined"/>
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                
                {username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )}
                 <TextField
                 required
                 fullWidth
                  label="Bio"
                  margin="normal"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}/>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />

                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  disabled={isLoading}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                   Sign Up
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>

                <Button
                  disabled={isLoading}
                  fullWidth
                  variant="text"
                  onClick={toggleLogin}
                >
                  Log In Instead
                </Button>
              </form>
            </>
          ) 
          
        }    
        </Paper>
        </Container>
          </div>
  )
}

export default Login