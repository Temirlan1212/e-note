import { FC, useState } from "react";

import { useTranslations } from "next-intl";
import Link from "next/link";

import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import { Box, Typography } from "@mui/material";

import { useProfileStore } from "@/stores/profile";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";

import Button from "@/components/ui/Button";
import ApplicationStatusRead from "./ApplicationStatusRead";
import ApplicationStatusView from "./ApplicationStatusView";
import ApplicationStatusRating from "./ApplicationStatusRating";

interface IApplicationStatusInfoContentProps {
  id?: number;
}

interface IPartner {
  fullName: string;
  id: number;
}

interface IPartnerData {
  id: number;
  partnerList?: IPartner[];
}

const ApplicationStatusInfoContent: FC<IApplicationStatusInfoContentProps> = (props) => {
  const { id } = props;
  const t = useTranslations();

  const [accessToView, setAccessToView] = useState(false);

  const profile = useProfileStore((state) => state);

  const { data, loading } = useFetch(id != null ? `/api/applications/${id}` : "", "POST");
  const { data: partners } = useFetch<FetchResponseBody<IPartnerData[]>>(
    profile.userData?.activeCompany ? "/api/profile/partner-list/" + profile.userData?.activeCompany.id : "",
    "POST"
  );

  const userIsNotary = profile?.userData?.group?.id === 4;
  const applicationStatusIsCompleted = data?.data?.[0]?.statusSelect === 1;

  const extractIDs = (...data: any) => {
    const allIDs: number[] = [];

    data.forEach((data: any) => {
      if (!Array.isArray(data) && typeof data !== "object") {
        allIDs.push(data);
      }

      if (Array.isArray(data)) {
        allIDs.push(...data.map((item) => item.id));
      } else if (typeof data === "object" && data?.id != null) {
        allIDs.push(data.id);
      }
    });

    return allIDs;
  };

  useEffectOnce(() => {
    if (data?.data?.[0] != null) {
      const applicationData = data.data[0];
      const { requester, members, createdBy } = applicationData;

      const currentUserID = profile.userData?.activeCompany?.id;
      const membersID = extractIDs(
        requester,
        members,
        createdBy,
        partners?.data?.[0].partnerList,
        partners?.data?.[0].id
      );
      const isUserInMembers = membersID.includes(currentUserID as number);

      if (isUserInMembers) {
        setAccessToView(true);
      }
    }
  }, [data]);

  return (
    <Box
      sx={{
        p: {
          xs: "10px",
          md: "40px",
        },
      }}
      display="flex"
      flexDirection="column"
      gap="40px"
    >
      {accessToView && !userIsNotary && applicationStatusIsCompleted && (
        <ApplicationStatusRating data={data?.data[0]} />
      )}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          {t("InformationAboutStatusApplication")}
        </Typography>
        <Link href="/applications">
          <Button
            variant="text"
            sx={{
              backgroundColor: "none",
              color: "#1BAA75",
              fontSize: "16px",
              width: "auto",
              ":hover": {
                backgroundColor: "transparent !important",
              },
            }}
            startIcon={<KeyboardBackspaceOutlinedIcon />}
          >
            {t("Back")}
          </Button>
        </Link>
      </Box>
      <ApplicationStatusRead data={data?.data?.[0]} loading={loading} />
      {userIsNotary
        ? accessToView &&
          data?.data[0]?.documentInfo?.pdfLink &&
          data?.data[0]?.documentInfo?.token && <ApplicationStatusView data={data?.data[0]} />
        : data?.data[0]?.documentInfo?.pdfLink &&
          data?.data[0]?.documentInfo?.token && <ApplicationStatusView data={data?.data[0]} />}
    </Box>
  );
};

export default ApplicationStatusInfoContent;
