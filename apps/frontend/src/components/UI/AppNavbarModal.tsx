"use client";

import { Dispatch, FC, Fragment, SetStateAction } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HeaderTitle from "./HeaderTitle";
import MenuList from "@mui/material/MenuList";
import HeaderMenuItem from "./HeaderMenuItem";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps, accordionSummaryClasses } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import { headerMenu } from "@/types/headerMenu";
import HeaderMenuType from "@/entries/headerMenuType.entry";
import config from "@/config";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  data: Array<headerMenu>;
  currentLocale: string;
  isLoggedIn: boolean;
  setSearchModalOpen: () => void;
}

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: "transparent",
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />} {...props} />
))(({ theme }) => ({
  backgroundColor: "transparent",
  flexDirection: "row",
  padding: 0,
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
    transform: "rotate(180deg)",
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: 0,
  border: "none",
}));

const AppNavbarModal: FC<Props> = ({ open, setOpen, data, currentLocale, isLoggedIn, setSearchModalOpen }) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      slots={{
        transition: Slide,
      }}
      fullScreen
    >
      <Box sx={{ mt: 3, px: 2, py: 0 }}>
        <Stack direction="row" sx={{ pb: 2, width: "100%", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ height: "25px" }}>
            <img loading="lazy" src="/statics/website/logo.png" width="125" height="25" alt="in-italy.it" />
          </Link>
          <IconButton onClick={() => setOpen(false)} aria-label="close" sx={{ padding: 0 }}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ py: 2, width: "100%", alignItems: "center", justifyContent: "center" }}>
          <IconButton
            component={Link}
            href={isLoggedIn ? `/${currentLocale}/profile` : `/${currentLocale}/login`}
            onClick={() => setOpen(false)}
            sx={{ color: "black" }}
            aria-label="profile"
          >
            <Avatar sx={{ backgroundColor: "#000" }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
          {isLoggedIn && (
            <IconButton
              onClick={() => {
                signOut({ callbackUrl: `/${currentLocale}`, redirect: true });
                setOpen(false);
              }}
              sx={{ color: "black" }}
              aria-label="logout"
            >
              <LogoutIcon sx={{ width: 32, height: 32 }} />
            </IconButton>
          )}
          <IconButton
            sx={{ color: "black" }}
            aria-label="search"
            onClick={() => {
              setSearchModalOpen();
              setOpen(false);
            }}
          >
            <SearchIcon sx={{ width: 32, height: 32 }} />
          </IconButton>
        </Stack>

        {data
          .filter((item) => item.type === HeaderMenuType.DROPDOWN || item.type === HeaderMenuType.LINK)
          .sort((a, b) => a.position - b.position)
          .map((item, index) =>
            item.type === HeaderMenuType.DROPDOWN ? (
              <Accordion key={index} elevation={0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={500} fontSize={config.fontSizeDefaultText}>
                    {item.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {item.children
                    .sort((a, b) => a.position - b.position)
                    .map((child, index) => (
                      <Fragment key={index}>
                        {child.type === HeaderMenuType.TITLE && <HeaderTitle text={child.title} />}
                        <MenuList>
                          {child.children.map((subChild, index) => (
                            <HeaderMenuItem key={index} text={subChild.title} linkUrl={subChild.url} image={subChild.icon} />
                          ))}
                        </MenuList>
                      </Fragment>
                    ))}
                </AccordionDetails>
              </Accordion>
            ) : (
              <MenuList key={index} sx={{ padding: 0 }}>
                <MenuItem component={Link} href={item.url} sx={{ px: 0 }}>
                  <ListItemText primary={item.title} slotProps={{ primary: { fontWeight: 500, fontSize: config.fontSizeDefaultText } }} />
                </MenuItem>
              </MenuList>
            )
          )}
      </Box>
    </Dialog>
  );
};

export default AppNavbarModal;
