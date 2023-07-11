import * as React from "react";
import { Box, Container, List, ListItem, Typography } from "@mui/material";
import Link from "./Link";
import Image from "next/image";

interface IFooterSection {
  title?: string;
  items?: Map<string | React.ReactElement, string>;
}

export default function Footer() {
  const footerData = {
    Community: new Map([]),
    Sample: new Map([]),
    Resource: new Map([]),
  };

  return (
    <Box
      sx={({ breakpoints: { down } }) => ({
        bgcolor: "success.main",
        padding: "48px",
        [down("md")]: {
          padding: "30px",
        },
      })}
    >
      <Container>
        <Box
          sx={({ breakpoints: { down } }) => ({
            display: "flex",
            justifyContent: "space-between",
            [down("md")]: {
              flexDirection: "column",
              gap: "20px",
            },
          })}
        >
          <Box>
            <Link href="/" sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Image src="/images/logo.png" alt="E-notariat" width={48} height={48} />
              <Typography sx={{ fontWeight: 600, fontSize: "16px", color: "white" }}>E-NOTARIAT</Typography>
            </Link>
          </Box>

          <Box sx={{ display: "flex", gap: "50px" }}>
            <FooterSection />
            <FooterSection />
            <FooterSection />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

const FooterSection: React.FC<IFooterSection> = ({ title, items }) => {
  return (
    <Box>
      <Typography
        sx={({ breakpoints: { down } }) => ({
          color: "white",
          fontWeight: 500,
          fontSize: "20px",
          padding: {
            padding: "0 0 26px 0",
            [down("md")]: {
              padding: "0 0 16px 0",
            },
          },
        })}
      >
        Общество
      </Typography>

      <List>
        <ListItem sx={{ padding: "0 0 24px 0" }}>
          <Link href="/">
            <Typography sx={{ fontSize: "16px", color: "white" }}>About Us</Typography>
          </Link>
        </ListItem>

        <ListItem sx={{ padding: "0 0 24px 0" }}>
          <Link href="/">
            <Typography sx={{ fontSize: "16px", color: "white" }}>About Us</Typography>
          </Link>
        </ListItem>
        <ListItem sx={{ padding: "0 0 24px 0" }}>
          <Link href="/">
            <Typography sx={{ fontSize: "16px", color: "white" }}>About Us</Typography>
          </Link>
        </ListItem>
        <ListItem sx={{ padding: "0 0 24px 0" }}>
          <Link href="/">
            <Typography sx={{ fontSize: "16px", color: "white" }}>About Us</Typography>
          </Link>
        </ListItem>
      </List>
    </Box>
  );
};
