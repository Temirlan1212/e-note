import { Box } from "@mui/material";

import ProfileTabs from "./ProfileTabs";

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
      <ProfileTabs />
    </Box>
  );
};

export default ProfileContent;
