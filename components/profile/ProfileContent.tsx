import { Box } from "@mui/material";

import ProfileForm from "./ProfileForm";

interface IProfileContentProps {}

const ProfileContent = (props: IProfileContentProps) => {
  return (
    <Box
      component="section"
      padding="30px 40px"
      sx={{
        backgroundColor: "#fff",
      }}
    >
      <ProfileForm />
    </Box>
  );
};

export default ProfileContent;
