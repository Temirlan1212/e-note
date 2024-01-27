import { FC, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { Avatar, Box, Typography, List, ListItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IPartner } from "@/models/user";

interface ITestatorInfoProps {
  testatorInfo: FetchResponseBody | null;
}

const TestatorInfo: FC<ITestatorInfoProps> = ({ testatorInfo }) => {
  const t = useTranslations();
  const locale = useLocale();
  const theme = useTheme();

  const [imageURL, setImageURL] = useState<string | null>(null);

  const { data: imageData, update: getImage } = useFetch<Response>("", "GET", {
    returnResponse: true,
  });

  useEffectOnce(() => {
    const pictureId = testatorInfo?.data?.[0]?.requester?.[0]?.picture?.id;
    if (pictureId) {
      getImage(`/api/user/image/` + pictureId);
    }
  }, [testatorInfo]);

  useEffectOnce(async () => {
    const base64String = await imageData?.text();
    if (base64String) {
      setImageURL(`data:image/jpeg;base64,${base64String}`);
    }
  }, [imageData]);

  const getAddressFullName = (data: IPartner) => {
    const { mainAddress } = data || {};
    const { region, district, city, addressL4, addressL3, addressL2 } = mainAddress || {};

    const key = locale !== "en" ? "$t:name" : "name";
    const fallbackKey = locale !== "en" ? "name" : "$t:name";
    const formatAddressPart = (part: any) => part?.[key] || part?.[fallbackKey] || "";

    const formattedRegion = formatAddressPart(region);
    const formattedDistrict = formatAddressPart(district);
    const formattedCity = formatAddressPart(city);

    const addressParts = [
      [formattedRegion, formattedDistrict, formattedCity].filter(Boolean).join(", "),
      [addressL4, addressL3, addressL2].filter(Boolean).join(" "),
    ];

    return addressParts.filter(Boolean).join(", ");
  };

  const titles = [
    {
      title: "PIN",
      value: testatorInfo?.data?.[0]?.requester?.[0]?.personalNumber
        ? testatorInfo?.data?.[0]?.requester?.[0]?.personalNumber
        : t("absent"),
    },
    {
      title: "Last name",
      value: testatorInfo?.data?.[0]?.requester?.[0]?.lastName
        ? testatorInfo?.data?.[0]?.requester?.[0]?.lastName
        : t("absent"),
    },
    {
      title: "Имя",
      value: testatorInfo?.data?.[0]?.requester?.[0]?.firstName
        ? testatorInfo?.data?.[0]?.requester?.[0]?.firstName
        : t("absent"),
    },
    {
      title: "Middle name",
      value: testatorInfo?.data?.[0]?.requester?.[0]?.middleName
        ? testatorInfo?.data?.[0]?.requester?.[0]?.middleName
        : t("absent"),
    },
    {
      title: "Date of birth",
      value: testatorInfo?.data?.[0]?.requester?.[0]?.birthDate
        ? testatorInfo?.data?.[0]?.requester?.[0]?.birthDate
        : t("absent"),
    },
    {
      title: "Date of death",
      value: testatorInfo?.data?.[0]?.requester?.[0]?.deathDate
        ? testatorInfo?.data?.[0]?.requester?.[0]?.deathDate
        : t("absent"),
    },
    {
      title: "Place of last residence",
      value: getAddressFullName(testatorInfo?.data?.[0]),
    },
    {
      title: "End date of inheritance",
      value: testatorInfo?.data?.[0]?.notaryInheritanceEndDate
        ? testatorInfo?.data?.[0]?.notaryInheritanceEndDate
        : "---",
    },
  ].filter(Boolean);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      <Typography variant="h4" pl="16px">
        {t("Информация о наследодателе")}
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
            display: "flex",
            gap: "25px",
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

export default TestatorInfo;
