import { Rating as MUIRating } from "@mui/material";

interface IRatingProps {
  value: number;
  readOnly?: boolean;
  onChange?: (newValue: number) => void;
}

const Rating: React.FC<IRatingProps> = ({ value, readOnly = false, onChange }) => {
  const handleRatingChange = (event: React.ChangeEvent<{}>, newValue: number | null) => {
    if (!readOnly && newValue !== null && onChange) {
      onChange(newValue);
    }
  };

  return (
    <MUIRating
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

export default Rating;
