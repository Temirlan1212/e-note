import { NextRouter, useRouter } from "next/router";
import { styled, Link as MuiLink, LinkProps } from "@mui/material";

interface ILinkProps extends LinkProps {
  href: string;
  isActive?: boolean;
}

function Link({ children, href, isActive, ...props }: ILinkProps) {
  const StyledLink = styled(MuiLink)(({ theme: { palette } }) => ({
    color: isActive ? palette.success.main : "inherit",
    textDecoration: "none",
  }));

  const router: NextRouter = useRouter();
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <StyledLink {...props} href={href} onClick={handleClick}>
      {children}
    </StyledLink>
  );
}

export default Link;
