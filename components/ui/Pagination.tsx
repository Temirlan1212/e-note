import { Pagination, PaginationProps, styled } from "@mui/material";

const StyledPagination = styled(Pagination)(({ theme }) => ({
  display: "flex",
  ".MuiPagination-ul": {
    border: " 1px solid #CDCDCD",
    background: "#fff",
    padding: "10px 12px",
    display: "flex",
    justifyContent: "center",
  },

  "& .MuiPaginationItem-root": {
    color: theme.palette.text.primary,
    background: "#FFF !important",
    borderRadius: 0,
    "&.Mui-selected": {
      border: " 1px solid  #1BAA75",
      color: "#1BAA75",
      "&:hover": {
        background: "white !important",
      },
      "&:active": {
        background: "white !important",
      },
    },
    "&:hover": {
      border: " 1px solid  #1BAA75",
      color: "#1BAA75",
      background: "white !important",
    },
  },
}));

interface PaginationComponentProps extends PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  ...props
}) => {
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  return <StyledPagination count={totalPages} onChange={handlePageChange} page={currentPage} {...props} />;
};

export default PaginationComponent;
