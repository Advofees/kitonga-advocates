import * as React from "react";
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  SxProps,
  Theme,
} from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import { MUI_STYLES } from "../lib/MUI_STYLES";
import { findIndexOrDefault } from "../lib/utils";

export interface SplitButtonOption {
  value: string;
  name: string;
}

export interface SplitButtonProps {
  prefix?: React.ReactNode;
  initialValue?: string;
  title?: string;
  sx?: SxProps<Theme>;
  options: SplitButtonOption[];
  onClick?: (currentOption: SplitButtonOption) => void;
  onChange?: (newOption: SplitButtonOption) => void;
}

export function SplitButton({
  prefix = "",
  initialValue,
  title,
  sx = MUI_STYLES.Button,
  options,
  onClick,
  onChange,
}: SplitButtonProps) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(
    findIndexOrDefault(options, (op) => op.value === initialValue)
  );

  const handleMenuItemClick = (
    _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    setOpen(false);
    if (onChange) {
      onChange(options[index]);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup
        sx={sx}
        size="small"
        variant="contained"
        ref={anchorRef}
        aria-label="Button group with a nested menu"
      >
        <Button
          title={title}
          size="small"
          sx={sx}
          onClick={() => {
            if (onClick) {
              onClick(options[selectedIndex]);
            }
          }}
        >
          <span className="truncate flex items-center">
            {prefix}
            {options[selectedIndex].name}
          </span>
        </Button>
        <Button
          title={title}
          sx={sx}
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDown fontSize="small" />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={index}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      <span className="truncate">{option.name}</span>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
