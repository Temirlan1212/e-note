import Button from "@/components/ui/Button";
import { Box, BoxProps } from "@mui/material";
import React, { Dispatch, PropsWithChildren, SetStateAction, useState } from "react";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

type TProps = {
  wrapper: Partial<BoxProps>;
  collapsableContainerWrapper: Partial<BoxProps>;
};

type TTrigger = Dispatch<SetStateAction<boolean>>;

type TSlots = {
  trigger?: (callback: TTrigger) => React.ReactNode;
};

interface IContentTogllerProps {
  slotProps?: Partial<TProps>;
  slots?: TSlots;
}

const ContentTogller = React.forwardRef<HTMLDivElement, PropsWithChildren<IContentTogllerProps>>(
  ({ children, ...props }, ref) => {
    const [isTriggered, setIsTriggered] = useState(true);
    const wrapperProps = props.slotProps?.wrapper ?? {};
    const collapsableContainerWrapper = props.slotProps?.collapsableContainerWrapper ?? {};
    const triggerSlot = props.slots?.trigger;

    return (
      <Box ref={ref} display="flex" flexDirection="column" gap="20px" {...wrapperProps}>
        {triggerSlot ? (
          triggerSlot(setIsTriggered)
        ) : (
          <ContentTogllerTrigger trigger={setIsTriggered} isTriggered={isTriggered} />
        )}
        <Box
          maxHeight={isTriggered ? "1000px" : 0}
          overflow="hidden"
          {...collapsableContainerWrapper}
          sx={{ transition: "max-height 0.3s ease-out", ...(collapsableContainerWrapper?.sx || {}) }}
        >
          {children}
        </Box>
      </Box>
    );
  }
);

const ContentTogllerTrigger = React.forwardRef<HTMLButtonElement, { trigger: TTrigger; isTriggered: boolean }>(
  ({ trigger, isTriggered, ...props }, ref) => {
    const toggleTrigger = () => trigger((prev) => !prev);
    const type = isTriggered ? "danger" : "secondary";
    const text = isTriggered ? "close filter" : "open filter";
    const Icon = isTriggered ? FilterAltOffOutlinedIcon : FilterAltIcon;

    return (
      <Button
        ref={ref}
        startIcon={<Icon />}
        buttonType={type}
        sx={{ width: { base: "100%", md: "320px" }, padding: "10px 0" }} // Corrected the "sx" prop
        onClick={toggleTrigger}
        {...props}
      >
        {text}
      </Button>
    );
  }
);

ContentTogller.displayName = "ContentTogller";
ContentTogllerTrigger.displayName = "ContentTogllerTrigger";

export default ContentTogller;
