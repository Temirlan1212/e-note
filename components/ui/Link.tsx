import { NextRouter, useRouter } from "next/router";
import { Link as MuiLink, LinkProps, styled } from "@mui/material";

interface ILinkProps extends LinkProps {
  href: string;
  isActive?: boolean;
  activeColor?: string;
  color?: string;
}

function Link({ children, href, isActive, activeColor, color, ...props }: ILinkProps) {
  const StyledLink = styled(MuiLink)(() => ({
    textDecoration: "none",
  }));

  const router: NextRouter = useRouter();
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <StyledLink
      href={href}
      onClick={handleClick}
      color={isActive ? activeColor ?? "success.main" : color ?? "inherit"}
      {...props}
    >
      {children}
    </StyledLink>
  );
}

export default Link;
