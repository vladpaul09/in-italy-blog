import { FC } from "react";
import ListItemButton, { ListItemButtonProps } from "@mui/material/ListItemButton";
import Link from "next/link";

const SidebarListItemButton: FC<ListItemButtonProps & { href: string }> = ({ href, ...props }) => (
  <ListItemButton
    component={Link}
    href={href}
    {...props}
    sx={{
      color: "rgba(0, 0, 0, 0.87)",
      fontWeight: 400,
      textTransform: "none",
      fontSize: "18px",
    }}
  />
);

export default SidebarListItemButton;
