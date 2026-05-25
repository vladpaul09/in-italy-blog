"use client";

import { FC, useState } from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import NavButton from "../Shared/Buttons/NavButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { headerMenu } from "@/types/headerMenu";
import HeaderMenuItem from "./HeaderMenuItem";
import MenuList from "@mui/material/MenuList";
import HeaderMenuType from "@/entries/headerMenuType.entry";
import config from "@/config";

interface Props {
  name: string;
  data: Array<headerMenu>;
  isMenuFixed: boolean;
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
  width: "100%!important",
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.87)",
    padding: theme.spacing(2),
    maxWidth: "none",
    maxHeight: "none",
    fontSize: theme.typography.pxToRem(config.fontSizeDefaultText),
    border: "1px solid #dadde9",
  },
}));

const MegaMenuTooltipDropdown: FC<Props> = ({ name, data, isMenuFixed }) => {
  const [open, setOpen] = useState<boolean>(false);

  const innerRowThreshold = 10;
  const totalGridColumns = 12;
  const columnThreshold = 4;

  const arraySplitter = (array: headerMenu[], threshold: number) => {
    const result: headerMenu[][] = [];
    let currentGroup: headerMenu[] = [];

    if (!array || array.length === 0) {
      return result;
    }

    array.forEach((item, index) => {
      currentGroup.push(item);
      if ((index + 1) % threshold === 0 || index === array.length - 1) {
        result.push(currentGroup);
        currentGroup = [];
      }
    });

    return result;
  };

  const dataSplit = data.map((item) => ({
    ...item,
    children: arraySplitter(item.children, innerRowThreshold),
  }));

  const totalCells = dataSplit.reduce((total, item) => total + item.children.length, 0);

  return (
    <HtmlTooltip
      disableFocusListener
      disableTouchListener
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      title={
        <Grid container spacing={2} sx={{ alignItems: "start" }}>
          {dataSplit.map((child, index) => (
            <Grid
              key={index}
              container
              size={totalCells < columnThreshold ? totalGridColumns / totalCells : (totalGridColumns / columnThreshold) * child.children.length}
            >
              {child.type === HeaderMenuType.TITLE && (
                <Grid size={12}>
                  <Typography key={index} sx={{ fontWeight: config.fontWeightTitleDefault, fontSize: config.fontSizeDefaultText }} variant="body1">
                    {child.title}
                  </Typography>
                </Grid>
              )}
              {child.type === HeaderMenuType.LINK && (
                <Grid size={12}>
                  <HeaderMenuItem key={index} text={child.title} linkUrl={child.url} image={child.icon} onClick={() => setOpen(false)} />
                </Grid>
              )}
              {child.children.map((group, index, self) => (
                <Grid size={12 / self.length} key={index}>
                  <MenuList sx={{ padding: 0 }}>
                    {group.map((subChild, index) => (
                      <HeaderMenuItem key={index} text={subChild.title} linkUrl={subChild.url} image={subChild.icon} onClick={() => setOpen(false)} />
                    ))}
                  </MenuList>
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      }
    >
      <NavButton
        variant="text"
        endIcon={<ExpandMoreIcon />}
        sx={[open && { borderBottomColor: "primary.main" }, isMenuFixed ? { color: "black" } : { color: "white" }]}
      >
        {name}
      </NavButton>
    </HtmlTooltip>
  );
};

export default MegaMenuTooltipDropdown;
