import * as React from "react";
import { Box, Container, List, ListItem, Typography } from "@mui/material";
import Image from "next/image";
import Link from "@/ui/Link";

interface IFooterDataItem {
  content: string;
  route: string;
}

interface IFooterSection {
  title: string;
  items: IFooterDataItem[];
}

export default function Footer() {
  const footerData: Record<string, IFooterDataItem[]> = {
    Community: [
      { content: "About Us", route: "/about-us" },
      { content: "Guidelines and how to", route: "/" },
      { content: "Quote from the best", route: "/" },
      { content: "How to start a blog", route: "/" },
    ],
    Sample: [
      { content: "About Us", route: "/" },
      { content: "Guidelines and how to", route: "/" },
      { content: "Quote from the best", route: "/" },
      { content: "How to start a blog", route: "/" },
    ],
    Resource: [
      { content: "Accessibility", route: "/" },
      { content: "Usability", route: "/" },
      { content: "Marketplace", route: "/" },
      { content: "Design & Dev", route: "/" },
    ],
  };

  return (
    <Box
      sx={({ breakpoints: { down } }) => ({
        bgcolor: "success.main",
        padding: "48px 0",
        [down("md")]: {
          padding: "30px 0",
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

          <Box
            sx={({ breakpoints: { down } }) => ({
              display: "flex",
              gap: "60px",
              [down("sm")]: {
                flexDirection: "column",
                gap: "30px",
              },
            })}
          >
            {Object.entries(footerData).map((section, idx) => (
              <FooterSection title={section[0]} items={section[1]} key={idx} />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

const FooterSection: React.FC<IFooterSection> = ({ title, items }) => {
  return (
    <section>
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
        {title}
      </Typography>

      <List>
        {items.map((item, idx) => {
          return item?.content ? (
            <ListItem sx={{ padding: "0 0 24px 0" }} key={idx}>
              <Link href={item.route}>
                <Typography sx={{ fontSize: "16px", color: "white" }}>{item.content}</Typography>
              </Link>
            </ListItem>
          ) : (
            ""
          );
        })}
      </List>
    </section>
  );
};
