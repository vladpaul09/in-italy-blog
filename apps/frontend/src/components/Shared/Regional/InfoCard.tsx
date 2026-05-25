import { FC } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Link from "next/link";
import stripText from "@/utils/stripText";
import config from "@/config";
import EventDateText from "../Widgets/EventDateText";
import { staticStrings } from "@/types/staticStrings.type";
import infoPostType from "@/types/infoPost.type";

interface Props {
  object: infoPostType;
  locale: string;
  staticStrings: staticStrings;
}
const InfoCard: FC<Props> = ({ object, locale, staticStrings }) => {
  return (
    <CardActionArea component={Link} href={`/${locale}${object.url}`} className="global-border-radius" sx={{ height: "inherit" }}>
      <Card variant="outlined" sx={{ width: "100%", height: "500px" }}>
        <Box sx={{ position: "relative", width: "100%", height: "225px" }}>
          <Box
            component={Image}
            src={object.image}
            alt={object.title}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            sx={{ objectFit: "cover" }}
          />
        </Box>
        <CardContent sx={{ height: "210px" }}>
          <Box sx={{ height: "100%" }}>
            <Typography fontSize={config.fontSizeArticleTitle} fontWeight={config.fontWeightTitleDefault} sx={{ pb: 1 }}>
              {object.title}
            </Typography>
            {object.startDate && object.endDate && (
              <Box sx={{ pb: 1 }}>
                <EventDateText startDate={object.startDate} endDate={object.endDate} staticStrings={staticStrings} fontSize={14} />
              </Box>
            )}
            <Typography
              fontWeight={400}
              fontSize={config.fontSizeDefaultText}
              dangerouslySetInnerHTML={{ __html: stripText(object.description, true, 150) }}
            />
          </Box>
        </CardContent>
      </Card>
    </CardActionArea>
  );
};

export default InfoCard;
