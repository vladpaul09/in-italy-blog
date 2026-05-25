import { FC } from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import config from "@/config";

const NavButton: FC<ButtonProps> = (props) => (
  <Button
    {...props}
    variant="text"
    sx={[
      {
        color: "rgba(0, 0, 0, 0.87)",
        fontWeight: 500,
        textTransform: "none",
        margin: "auto",
        borderTop: "3px solid transparent",
        borderBottomColor: "transparent",
        borderBottomWidth: "3px",
        borderBottomStyle: "solid",
        borderRadius: "0px",
        fontSize: config.fontSizeDefaultText
      },
      ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
    ]}
  />
);

export default NavButton;
