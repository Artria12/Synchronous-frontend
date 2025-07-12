
import React, { useState } from 'react'
import { sampleUsers } from '../../constants/SampleData'
import UserItem from '../shared/UserItem'
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { setIsAddMember } from '../../redux/reducers/misc';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncMutation, useErrors } from '../../hooks/hooks';
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api';
const AddMemberDialog=({chatId})=>{
       const { isAddMember } = useSelector((state) => state.misc);
         const [addMembers, isLoadingAddMembers] = useAsyncMutation(
    useAddGroupMembersMutation
  );
  const dispatch=useDispatch();
     const addMemberSubmitHandler = () => {
    addMembers("Adding Members...", { members: selectedMembers, chatId });
    closeHandler();
  };
    const closeHandler=()=>{
         setSelectedMembers([])
         setMembers([])
         dispatch(setIsAddMember(false))
    }
       
     const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);
      const [Members,setMembers]=useState(sampleUsers)
      const [selectedMembers, setSelectedMembers] = useState([]);
          const selectMemberHandler = (id) => {
           setSelectedMembers((prev)=>prev.includes(id)?prev.filter((i)=>i!==id):[...prev,id])
      };

       useErrors([{ isError, error }]);
  return (
       <Dialog open={isAddMember} onClose={closeHandler}>
          <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
            <DialogTitle textAlign={'center'}>Add Member</DialogTitle>
            <Stack spacing={"1rem"}>
                {isLoading?<Skeleton/>:
                    data?.friends?.length>0?data?.friends?.map((i)=>(
                        <UserItem key={i._id} user={i} handler={selectMemberHandler}
                          isAdded={selectedMembers.includes(i._id)}/>
                    )):(
            <Typography textAlign={"center"}>No Friends</Typography>
          )
                }
            </Stack>
             <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button
            onClick={addMemberSubmitHandler}
            variant="contained"
            disabled={isLoadingAddMembers}
          >
            Submit Changes
          </Button>
        </Stack>
          </Stack>
       </Dialog>
  )
}

export default AddMemberDialog