import { FC, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { Avatar, Box, Typography, List, ListItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IPartner } from "@/models/user";

interface IHeirInfoProps {
  heirInfo: FetchResponseBody | null;
}

const HeirInfo: FC<IHeirInfoProps> = ({ heirInfo }) => {
  const t = useTranslations();
  const theme = useTheme();

  const [imageURL, setImageURL] = useState<string | null>(null);

  const { data: imageData, update: getImage } = useFetch<Response>("", "GET", {
    returnResponse: true,
  });

  useEffectOnce(() => {
    const pictureId = heirInfo?.data?.[0]?.picture?.id;
    if (pictureId) {
      getImage(`/api/user/image/` + pictureId);
    }
  }, [heirInfo]);

  useEffectOnce(async () => {
    const base64String = await imageData?.text();
    if (base64String) {
      setImageURL(`data:image/jpeg;base64,${base64String}`);
    }
  }, [imageData]);

  const titles = [
    {
      title: "PIN",
      value: heirInfo?.data?.[0]?.personalNumber ? heirInfo?.data?.[0]?.personalNumber : t("absent"),
    },
    {
      title: "Last name",
      value: heirInfo?.data?.[0]?.lastName ? heirInfo?.data?.[0]?.lastName : t("absent"),
    },
    {
      title: "First name",
      value: heirInfo?.data?.[0]?.firstName ? heirInfo?.data?.[0]?.firstName : t("absent"),
    },
    {
      title: "Middle name",
      value: heirInfo?.data?.[0]?.middleName ? heirInfo?.data?.[0]?.middleName : t("absent"),
    },
  ].filter(Boolean);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      <Typography variant="h4" color="">
        {t("Information about the heir")}
      </Typography>
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: "600",
          color: "#687C9B",
        }}
      >
        {t("Personal data")}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: {
            xs: "center",
            md: "space-between",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        <Box
          sx={{
            border: "1px solid #CDCDCD",
            padding: "25px 15px",
            display: "flex",
            gap: "25px",
            width: { xs: "100%", md: "70%" },
          }}
        >
          <List
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
            }}
          >
            {titles.map((el: any, idx: any) => {
              return (
                <ListItem
                  key={idx}
                  sx={{
                    gap: "10px",
                    display: "flex",
                    [theme.breakpoints.down("sm")]: {
                      flexDirection: "column",
                    },
                    alignItems: "start",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "600",
                      width: "100%",
                      minWidth: "260px",
                      maxWidth: { xs: "100%", md: "280px" },
                      [theme.breakpoints.down("sm")]: {
                        maxWidth: "unset",
                      },
                      wordBreak: "break-word",
                    }}
                  >
                    {t(el?.title)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "500",
                      width: "100%",
                      minWidth: "260px",
                      maxWidth: { xs: "100%", md: "380px" },
                      color: "#687C9B",
                      [theme.breakpoints.down("sm")]: {
                        maxWidth: "unset",
                      },
                      wordBreak: "break-all",
                    }}
                  >
                    {el?.value != null && el?.value !== "" ? el?.value : t("absent")}
                  </Typography>
                </ListItem>
              );
            })}
          </List>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            marginTop: { xs: "30px", sm: "30px", md: "unset", lg: "unset" },
            pr: "50px",
          }}
        >
          <Avatar
            sizes="194"
            sx={{
              bgcolor: "success.main",
              objectFit: "contain",
              height: { xs: "100px", sm: "200px" },
              width: { xs: "70px", sm: "170px" },
              borderRadius: 0,
            }}
            aria-label="recipe"
            src={imageURL ?? ""}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HeirInfo;
