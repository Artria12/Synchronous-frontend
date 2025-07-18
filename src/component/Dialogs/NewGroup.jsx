import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import UserItem from '../shared/UserItem';
import { sampleUsers } from '../../constants/SampleData';
import { useInputValidation } from "6pp";
import { useDispatch, useSelector } from 'react-redux';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api';
import { setIsNewGroup } from '../../redux/reducers/misc';
import toast from 'react-hot-toast';
import {useAsyncMutation} from '../../hooks/hooks.jsx'
const NewGroup=()=>{
     

    const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
     const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);


  
  const [Members,setMembers]=useState(sampleUsers)
  const [selectedMembers, setSelectedMembers] = useState([]);
         const groupName = useInputValidation("");
  
      const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please Select Atleast 3 Members");

    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };
    
    

       const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };
      const selectMemberHandler = (id) => {
       setSelectedMembers((prev)=>prev.includes(id)?prev.filter((i)=>i!==id):[...prev,id])
  };
  console.log(selectedMembers);
  console.log("new-group",data);
 return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4">
          New Group
        </DialogTitle>

        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        />

        <Typography variant="body1">Members</Typography>

        <Stack>
           {
            isLoading? <Skeleton/>:
            data?.friends?.map((i)=>(
                  <UserItem
                user={i}
                key={i._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
           }
        </Stack>

        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button
            variant="text"
            color="error"
            size="large"
            onClick={closeHandler}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default NewGroup