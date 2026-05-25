import { FC } from "react";
import Button, { ButtonProps } from "@mui/material/Button";

const HorizontalButton: FC<ButtonProps & { selected?: boolean }> = ({ selected, ...props }) => (
  <Button
    variant="outlined"
    className="global-border-radius"
    sx={[
      {
        paddingTop: 1.5,
        paddingBottom: 1.5,
        paddingLeft: 2,
        paddingRight: 2,
        color: "#000",
        textTransform: "none",
        fontSize: "14px",
        fontWeight: "400",
        border: "none",
        overflowWrap: "break-word",
        minWidth: "unset",
      },
      selected ? { backgroundColor: "primary.main" } : { backgroundColor: "#fff" },
    ]}
    {...props}
  />
);

export default HorizontalButton;
