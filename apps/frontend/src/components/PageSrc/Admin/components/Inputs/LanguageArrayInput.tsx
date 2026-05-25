import { FC, ReactNode, Children, cloneElement, isValidElement, useState, SyntheticEvent } from "react";
import { useGetList, TextInput, useTranslate, useResourceContext } from "react-admin";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { languageType } from "../../types/languages.type";
import ResourceType from "../../entries/resourceType.entry";
// import translate from "translate";

interface ILanguageArrayInput {
  source: string;
  children: ReactNode | Array<ReactNode>;
  isShow?: boolean;
}

interface ChildWithSourceProps {
  source: string;
  label?: string;
}

interface StyledTabProps {
  label: string;
}

const AntTabs = styled(Tabs)({ borderBottom: "1px solid #e8e8e8", "& .MuiTabs-indicator": { backgroundColor: "#1890ff" } });

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel: FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div {...other} role="tabpanel" hidden={value !== index} id={`language-input-tabpanel-${index}`} aria-labelledby={`language-input-tab-${index}`}>
    {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
  </div>
);

const a11yProps = (index: number) => ({ id: `language-input-tab-${index}`, "aria-controls": `language-input-tabpanel-${index}` });

const AntTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: "none",
  minWidth: 0,
  [theme.breakpoints.up("sm")]: { minWidth: 0 },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  "&:hover": { color: "#40a9ff", opacity: 1 },
  "&.Mui-selected": { color: "#1890ff", fontWeight: theme.typography.fontWeightMedium },
  "&.Mui-focusVisible": { backgroundColor: "#d1eaff" },
}));

const LanguageArrayInput: FC<ILanguageArrayInput> = ({ source, children, isShow }) => {
  const t = useTranslate();
  const resource = useResourceContext();

  const [tabValue, setTabValue] = useState<number>(0);
  const [translationLoading, setTranslationLoading] = useState<boolean>(false);

  const { data, isLoading } = useGetList<languageType>(ResourceType.Languages, {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "sortOrder", order: "ASC" },
  });
  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // const separateRichText = async (input: string) => {
  //   const tagRegex = /(<[^>]+>)/g;
  //   const parts = input.split(tagRegex);
  //   const translatedParts = await Promise.all(
  //     parts.map(async (part) => {
  //       if (!tagRegex.test(part) && part.trim() !== "") {
  //         return " " + await translate(part, { to: "en", from: "it" });
  //       }
  //       return part;
  //     })
  //   );
  //   return translatedParts.join("");
  // };

  // const handleTranslate = async (input: any) => {
  //   setTranslationLoading(true);
  //   const updatedValue = {
  //     ...value,
  //     en: {
  //       ...value.en,
  //       title: await separateRichText(input.it.title),
  //       description: await separateRichText(input.it.description),
  //     },
  //   };
  //   onChange(updatedValue);
  //   setTranslationLoading(false);
  // };

  return (
    <Card variant="outlined" sx={{ width: "100%", p: 0, m: 0 }}>
      <CardContent sx={{ m: 0, p: "0!important" }}>
        {!data || isLoading || translationLoading ? (
          <Box sx={{ width: "100%", p: 2 }}>
            <LinearProgress />
          </Box>
        ) : (
          <>
            <AntTabs value={tabValue} onChange={handleChange} aria-label="ant tab language input">
              {data.map((item, index) => (
                <AntTab key={index} label={item.name} {...a11yProps(index)} />
              ))}
            </AntTabs>
            {data.map((item, index1) => (
              <CustomTabPanel key={index1} value={tabValue} index={index1}>
                {!isShow && <TextInput source={`${source}.${item.id}.langId`} defaultValue={item.id} sx={{ display: "none" }} />}
                {Children.toArray(children).map((child) =>
                  isValidElement(child)
                    ? cloneElement(child, {
                        source: `${source}.${item.id}.${(child.props as ChildWithSourceProps).source}`,
                        label: (child.props as ChildWithSourceProps).label
                          ? (child.props as ChildWithSourceProps).label
                          : t(`resources.${resource}.fields.${source}.${(child.props as ChildWithSourceProps).source}`),
                      } as ChildWithSourceProps)
                    : child
                )}
                <br />
                {/* {item.id === "en" && <Button label="Translate to English" onClick={() => {handleTranslate(value)}} />} */}
              </CustomTabPanel>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LanguageArrayInput;
