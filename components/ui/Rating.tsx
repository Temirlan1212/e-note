import React from "react";
import { Rating, Icon } from "@mui/material";

interface RatingComponentProps {
  value: number;
  readOnly?: boolean;
  onChange?: (newValue: number) => void;
}

const RatingComponent: React.FC<RatingComponentProps> = ({ value, readOnly = false, onChange }) => {
  const handleRatingChange = (event: React.ChangeEvent<{}>, newValue: number | null) => {
    if (!readOnly && newValue !== null && onChange) {
      onChange(newValue);
    }
  };

  return (
    <Rating
      name="rating"
      value={value}
      onChange={handleRatingChange}
      defaultValue={0}
      precision={1}
      max={5}
      readOnly={readOnly}
      disabled={readOnly}
    />
  );
};

export default RatingComponent;
