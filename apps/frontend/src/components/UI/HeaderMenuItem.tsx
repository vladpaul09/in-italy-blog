import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import stripText from "@/utils/stripText";
import config from "@/config";

interface Props {
  linkUrl: string;
  text: string;
  image?: {
    src: string;
    title: string;
  } | null;
}

const HeaderMenuItem: FC<Props & MenuItemProps> = ({ text, linkUrl, image, ...props }) => (
  <MenuItem component={Link} href={linkUrl} {...props}>
    {image && (
      <div className="border-primary-main mr-2 w-[40px] h-[40px]">
        <Image className="rounded-full w-full h-full object-cover" src={image.src} alt={image?.title} width={40} height={40} />
      </div>
    )}
    <ListItemText primary={stripText(text, true, 30)} slotProps={{ primary: { fontWeight: 400, fontSize: config.fontSizeDefaultText } }} />
  </MenuItem>
);

export default HeaderMenuItem;
