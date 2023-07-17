import React, { FC } from "react";
import { Avatar, Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { NotaryCardProps } from "@/models/notaries/notary";
import Rating from "../ui/Rating";

const NotariesCard: FC<NotaryCardProps> = ({ notary }) => {
  return (
    <Card
      sx={{
        width: "17.8rem",
        borderRadius: 0,
        boxShadow: 0,
        backgroundColor: "inherit",
        transition: "all .5s ease",
        "&:hover": { backgroundColor: "white", boxShadow: "0px 10px 20px 0px #cbcaca", cursor: "pointer" },
      }}
    >
      <CardHeader
        sx={{
          display: "flex",
          flexDirection: "column",
          ".MuiCardHeader-avatar": {
            marginRight: 0,
          },
        }}
        avatar={
          <Avatar sizes="100" sx={{ bgcolor: "success.main", width: "100px", height: "100px" }} aria-label="recipe">
            <PermIdentityIcon sx={{ width: "50px", height: "50px" }} />
          </Avatar>
        }
        titleTypographyProps={{ fontSize: "18px", fontWeight: 500, textAlign: "center", marginTop: "20px" }}
        title={notary.name}
      />
      <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
        <Box sx={{ display: "flex" }} gap="8px">
          <Rating value={notary.rating} readOnly />
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            4,0
          </Typography>
          <Typography
            sx={{
              color: "#BDBDBD",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            45 оцен.
          </Typography>
        </Box>
        <Box sx={{ width: "100%", marginTop: "20px" }}>
          <Typography>{notary.region},</Typography>
          <Typography>{notary.area}.</Typography>
          <Typography>{notary.location}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotariesCard;
