import { FC, useState } from "react";

import { useTranslations } from "next-intl";
import { Box, CircularProgress, Typography } from "@mui/material";

import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import Hint from "@/components/ui/Hint";
import Rating from "@/components/ui/Rating";
import { IApplication } from "@/models/application";
import { IRating, IRatingItem } from "@/models/rating";

interface IApplicationStatusRatingProps {
  data: IApplication;
}

interface IRequestBody {
  companyId: number;
  requesterId: number;
  applicationId: number;
  grade?: number;
  ratingVersion?: number;
}

const ApplicationStatusRating: FC<IApplicationStatusRatingProps> = (props) => {
  const { data } = props;

  const t = useTranslations();

  const [ratingData, setRatingData] = useState<IRating | null>(null);

  const { update: ratingCreate, loading: ratingCreateLoading } = useFetch("", "PUT");
  const { update: ratingCheck, loading: ratingCheckLoading } = useFetch("", "POST");
  const { update: ratingEdit, loading: ratingEditLoading } = useFetch("", "POST");

  const applicationId = data?.id;
  const companyId = data?.company?.id;
  const requesterId = data?.requester[0]?.id;

  const requestBody: IRequestBody = {
    companyId: companyId,
    requesterId: requesterId,
    applicationId: applicationId,
  };

  const handleRatingChange = (newValue: number) => {
    if (applicationId && companyId && requesterId) {
      requestBody.grade = newValue;
      if ((ratingData?.total as number) > 0) {
        const ratingVersion = ratingData?.data[0]?.version;
        const ratingId = ratingData?.data[0]?.id;
        requestBody.ratingVersion = ratingVersion;

        editRating(requestBody, ratingId as number);
      } else {
        createRating(requestBody);
      }
    }
  };

  const editRating = (body: IRequestBody, ratingId: number) => {
    ratingEdit(`/api/rating/edit/${ratingId}`, body).then(() => {
      checkRating(body).then((ratingData) => {
        setRatingData(ratingData);
      });
    });
  };

  const createRating = (body: IRequestBody) => {
    ratingCreate("/api/rating/create/", body).then(() => {
      checkRating(body).then((ratingData) => {
        setRatingData(ratingData);
      });
    });
  };

  const checkRating = async (body: IRequestBody) => {
    const data = await ratingCheck("/api/rating/check/", body);
    return data;
  };

  useEffectOnce(async () => {
    if (data != null && applicationId && companyId && requesterId) {
      const ratingData = await checkRating(requestBody);
      setRatingData(ratingData);
    }
  }, [data]);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Hint type="hint" title={t("Rate the work of a notary")} sx={{ width: "100vw" }}>
        {ratingCreateLoading || ratingCheckLoading || ratingEditLoading ? (
          <CircularProgress />
        ) : (
          <Rating
            value={ratingData?.data && ratingData.data[0]?.grade ? parseFloat(ratingData.data[0].grade) : 0}
            onChange={handleRatingChange}
          />
        )}
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#687C9B",
          }}
        >
          {ratingData?.data && ratingData.data[0]?.grade
            ? t("RatingGradeText", { rating: parseFloat(ratingData.data[0].grade).toFixed(0) })
            : t("Your rating will help us in compiling the rating and is not binding")}
        </Typography>
      </Hint>
    </Box>
  );
};

export default ApplicationStatusRating;
