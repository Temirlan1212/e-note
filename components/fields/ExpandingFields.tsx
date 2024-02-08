import Accordion from "@/components/ui/Accordion";
import React, { PropsWithChildren } from "react";
import useEffectOnce from "@/hooks/useEffectOnce";
import { AccordionProps } from "@mui/material";

interface IExpandingFields extends Partial<AccordionProps> {
  permanentExpand?: boolean;
}

export default function ExpandingFields({
  title = "",
  children,
  permanentExpand = true,
}: PropsWithChildren<IExpandingFields>) {
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const handleQAExpanding = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded((prev) => !prev);
  };

  useEffectOnce(() => {
    setExpanded(!!permanentExpand);
  }, [permanentExpand]);

  return (
    <Accordion expanded={expanded} title={title} handleChange={handleQAExpanding} sx={{ bgcolor: "transparent" }}>
      <>{children}</>
    </Accordion>
  );
}
