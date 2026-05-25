import { FC } from "react";
import type { ReactNode } from "react";
import { Layout as RALayout, CheckForApplicationUpdate } from "react-admin";
import MainMenu from "./MainMenu";

const MainLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <RALayout menu={MainMenu}>
    {children}
    <CheckForApplicationUpdate />
  </RALayout>
);

export default MainLayout;
