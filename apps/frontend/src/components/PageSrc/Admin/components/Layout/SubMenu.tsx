import { FC, ReactNode, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";

type SubMenuProps = {
  text: string;
  icon: ReactNode;
  children: ReactNode;
};

const SubMenu: FC<SubMenuProps> = ({ text, icon, children }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <MenuItem
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
          primary={text}
          slotProps={{
            primary: {
              color: "inherit",
            },
          }}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </MenuItem>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        sx={{
          "& .RaMenuItemLink-icon": {
            paddingLeft: 1.5,
          },
        }}
      >
        {children}
      </Collapse>
    </>
  );
};

export default SubMenu;
