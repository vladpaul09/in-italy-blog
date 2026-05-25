"use client";

import { FC, lazy, Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import { headerMenu } from "@/types/headerMenu";
import HeaderMenuType from "@/entries/headerMenuType.entry";
import NavButton from "../Shared/Buttons/NavButton";
import MenuTooltipDropdown from "./MenuTooltipDropdown";
import { locale } from "@/types/language.type";
import { staticStrings } from "@/types/staticStrings.type";

const AppNavbarModal = lazy(() => import("./AppNavbarModal"));
const SearchModal = lazy(() => import("./SearchModal"));

interface Props {
  currentLocale: string;
  locales: Array<locale>;
  data: headerMenu[];
  staticStrings: staticStrings;
}

const AppNavbar: FC<Props> = ({ currentLocale, locales, data, staticStrings }) => {
  const { status } = useSession();
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const userMenuOpen = Boolean(userMenuAnchorEl);

  const [isMenuFixed, setIsMenuFixed] = useState<boolean>(false);

  const pathname = usePathname();
  const pathnameWithoutLocale = currentLocale ? pathname.replace(`/${currentLocale}`, "") : pathname;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    let ticking = false;
    let lastScrollY = 0;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const shouldBeFixed = currentScrollY > 0;

          // Only update state if the scroll position actually changed the fixed state
          if (shouldBeFixed !== lastScrollY > 0) {
            setIsMenuFixed(shouldBeFixed);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setIsMenuFixed]);

  return (
    <>
      <Suspense fallback={null}>
        <SearchModal open={searchModalOpen} staticStrings={staticStrings} onClose={() => setSearchModalOpen(false)} locale={currentLocale} />
        <AppNavbarModal
          data={data}
          isLoggedIn={status === "authenticated"}
          open={mobileMenuOpen}
          currentLocale={currentLocale}
          setOpen={setMobileMenuOpen}
          setSearchModalOpen={() => setSearchModalOpen(true)}
        />
      </Suspense>
      <AppBar
        position="fixed"
        sx={[
          { top: 0, left: 0, m: 0, p: 0 },
          !isMenuFixed
            ? { background: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0,0,0,0))", boxShadow: 0 }
            : { backgroundColor: "#fff", boxShadow: 0.5 },
        ]}
      >
        <Container
          maxWidth={false}
          sx={[
            {
              py: 1,
              display: { xs: "none", lg: "block" },
            },
          ]}
        >
          <Grid container spacing={2} sx={{ position: "relative", zIndex: 99 }}>
            <Grid size={1.2} sx={{ alignItems: "center", display: "flex" }}>
              <Link href={`/${currentLocale}`}>
                <img
                  src="/statics/website/logo.png"
                  width="125"
                  height="25"
                  alt="in-italy.it"
                  style={{ filter: isMenuFixed ? "invert(0)" : "invert(1)" }}
                />
              </Link>
            </Grid>
            <Grid container size={10.8} sx={{ justifyContent: "flex-end", alignItems: "center" }} spacing={1}>
              {data
                .sort((a, b) => a.position - b.position)
                .filter((item) => item.type === HeaderMenuType.DROPDOWN || item.type === HeaderMenuType.LINK)
                .map((item, index) =>
                  item.type === HeaderMenuType.DROPDOWN ? (
                    <Grid size="auto" key={index}>
                      <MenuTooltipDropdown name={item.title} data={item.children || []} isMenuFixed={isMenuFixed} />
                    </Grid>
                  ) : (
                    <Grid size="auto" key={index}>
                      <NavButton variant="text" component={Link} href={item.url} sx={[isMenuFixed ? { color: "black" } : { color: "white" }]}>
                        {item.title}
                      </NavButton>
                    </Grid>
                  )
                )}
              <Grid size="auto">
                <IconButton sx={[isMenuFixed ? { color: "black" } : { color: "white" }]} aria-label="search" onClick={() => setSearchModalOpen(true)}>
                  <SearchIcon />
                </IconButton>
              </Grid>
              <Grid size="auto">
                {status === "authenticated" ? (
                  <IconButton
                    sx={[isMenuFixed ? { color: "black" } : { color: "white" }]}
                    onClick={(e) => setUserMenuAnchorEl(e.currentTarget)}
                    aria-label="user account"
                  >
                    <PersonIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    sx={[isMenuFixed ? { color: "black" } : { color: "white" }]}
                    component={Link}
                    href={`/${currentLocale}/login`}
                    aria-label="login"
                  >
                    <PersonIcon />
                  </IconButton>
                )}
                <Menu anchorEl={userMenuAnchorEl} open={userMenuOpen} disableScrollLock={true} onClose={() => setUserMenuAnchorEl(null)}>
                  <MenuItem component={Link} href={`/${currentLocale}/profile`} onClick={() => setUserMenuAnchorEl(null)}>
                    <PersonIcon sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => signOut({ callbackUrl: `/${currentLocale}`, redirect: true })}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </Grid>

              <Grid size="auto">
                <NavButton
                  sx={[{ textTransform: "uppercase" }, isMenuFixed ? { color: "black" } : { color: "white" }]}
                  variant="text"
                  endIcon={<ExpandMoreIcon />}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <img src={`/statics/website/icons/${currentLocale}.svg`} height="20" width="20" />
                    <ListItemText disableTypography primary={currentLocale?.toLocaleUpperCase()} sx={{ width: "18px" }} />
                  </Stack>
                </NavButton>
                <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
                  {locales.map((locale) => (
                    <MenuItem key={locale.id} component={Link} href={`/${locale.id}${pathnameWithoutLocale}`}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <img src={`/statics/website/icons/${locale.id}.svg`} height="20" width="20" />
                        <ListItemText disableTypography primary={locale.name} />
                      </Stack>
                    </MenuItem>
                  ))}
                </Menu>
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <Container
          maxWidth={false}
          sx={[
            {
              py: 2,
              display: { xs: "block", lg: "none" },
            },
          ]}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Button
              startIcon={<MenuIcon />}
              sx={[{ textTransform: "none", fontSize: 18, fontWeight: 500 }, isMenuFixed ? { color: "black" } : { color: "white" }]}
              onClick={() => setMobileMenuOpen(true)}
            >
              Menu
            </Button>
            <Link href="/">
              <img
                src="/statics/website/logo.png"
                width="125"
                height="25"
                alt="in-italy.it"
                style={{ filter: isMenuFixed ? "invert(0)" : "invert(1)" }}
              />
            </Link>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <NavButton
                variant="text"
                endIcon={<ExpandMoreIcon color="inherit" />}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={[isMenuFixed ? { color: "black" } : { color: "white" }, { textTransform: "uppercase" }]}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <img src={`/statics/website/icons/${currentLocale}.svg`} height="20" width="20" />
                  <ListItemText primary={currentLocale.toLocaleUpperCase()} sx={{ width: "18px" }} />
                </Stack>
              </NavButton>
            </Stack>
          </Stack>
          <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
            {locales.map((locale) => (
              <MenuItem key={locale.id} component={Link} href={`/${locale.id}${pathnameWithoutLocale}`}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <img src={`/statics/website/icons/${locale.id}.svg`} height="20" width="20" />
                  <ListItemText disableTypography primary={locale.name} />
                </Stack>
              </MenuItem>
            ))}
          </Menu>
        </Container>
      </AppBar>
    </>
  );
};

export default AppNavbar;
