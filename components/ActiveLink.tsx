import { NextRouter, useRouter } from "next/router";
import { styled, Link } from "@mui/material";
import { HTMLAttributes } from "react";

interface IActiveLinkProps extends HTMLAttributes<HTMLElement> {
  href: string;
  isActive: boolean;
  locale?: string;
}

function ActiveLink({ children, href, isActive, ...props }: IActiveLinkProps) {
  const StyledLink = styled(Link)(({ theme: { palette } }) => ({
    color: isActive ? palette.success.main : palette.info.main,
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

export default ActiveLink;
