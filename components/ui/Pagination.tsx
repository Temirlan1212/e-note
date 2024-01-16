import useUiStore from "@/stores/ui";
import { Pagination as MUIPagination, PaginationProps, styled } from "@mui/material";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const StyledPagination = styled(MUIPagination)(({ theme }) => ({
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

interface IPaginationProps extends PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  persistName?: string;
}

const Pagination: React.FC<IPaginationProps> = ({ persistName, currentPage, totalPages, onPageChange, ...props }) => {
  const pathname = usePathname();
  const storageName = !!persistName ? pathname + " " + persistName : pathname;
  const setUiValue = useUiStore((state) => state.setValue);
  const paginationCurrentPages = useUiStore((state) => state.paginationCurrentPages);
  const prevPathname = useUiStore((state) => state.pathname);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    if (currentPage === page) return;
    onPageChange(page);
    setUiValue("paginationCurrentPages", { ...paginationCurrentPages, [storageName]: page });
  };

  useEffect(() => {
    if (pathname === prevPathname) {
      const page = paginationCurrentPages?.[storageName];
      if (page != null && !isNaN(page)) onPageChange(page);
    }
  }, []);

  useEffect(() => {
    setUiValue("pathname", pathname);
  }, [pathname]);

  return <StyledPagination count={totalPages} onChange={handlePageChange} page={currentPage} {...props} />;
};

export default Pagination;
