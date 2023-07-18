import React, { FC } from "react";
import { Avatar, Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { NotaryCardProps } from "@/models/notaries/notary";
import Rating from "../ui/Rating";

const NotariesCard: FC<NotaryCardProps> = ({ notary }) => {
  return (
    <Card
      sx={{
        width: { xs: "100%", md: "17.8rem" },
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
          flexDirection: {
            xs: "row",
            md: "column",
          },
          ".MuiCardHeader-avatar": {
            marginRight: 0,
          },
          gap: {
            xs: "10px",
            md: 0,
          },
        }}
        avatar={
          <Avatar
            sizes="100"
            sx={{
              bgcolor: "success.main",
              width: {
                xs: "50px",
                md: "100px",
              },
              height: {
                xs: "50px",
                md: "100px",
              },
              marginBottom: {
                xs: 0,
                md: "20px",
              },
            }}
            aria-label="recipe"
          >
            <PermIdentityIcon
              sx={{
                width: {
                  xs: "25px",
                  md: "50px",
                },
                height: {
                  xs: "25px",
                  md: "50px",
                },
              }}
            />
          </Avatar>
        }
        titleTypographyProps={{
          fontSize: {
            xs: "16px",
            md: "18px",
          },
          fontWeight: 500,
          textAlign: "center",
          whiteSpace: {
            xs: "nowrap",
            md: "normal",
          },
        }}
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
        <Box
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
            width: "100%",
            marginTop: "20px",
          }}
        >
          <Typography>{notary.region},</Typography>
          <Typography>{notary.area}.</Typography>
          <Typography>{notary.location}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotariesCard;
