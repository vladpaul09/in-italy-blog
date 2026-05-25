import { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Hotel } from "@/types/hotel.type";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Link from "next/link";
import LazyBackgroundImage from "@/components/Shared/LazyBackgroundImage";

interface Props {
  accommodation: Hotel;
}

const AccomodationCard: FC<Props> = ({ accommodation }) => (
  <CardActionArea component={Link} href={accommodation.details.web_url} target="_blank" sx={{ height: "inherit" }}>
    <Card className="global-border-radius" sx={{ width: "100%", height: "100%", boxShadow: "none" }}>
      <LazyBackgroundImage
        image={accommodation.photos && accommodation.photos.length > 0 ? accommodation.photos[0].images.large.url || "" : ""}
        height="225px"
        backgroundSize="cover"
        backgroundPosition="center"
      />
      <CardContent sx={{ height: "210px" }}>
        <Box>
          <br />
          <Typography fontWeight={400}>{accommodation.search.address_obj.city}</Typography>
          <Typography variant="h6" fontWeight={600}>
            {accommodation.search.name}
          </Typography>
        </Box>
        <Box>
          <Typography fontWeight={300} fontSize={14}>
            {accommodation.details.num_reviews} recensioni
          </Typography>
          <Box>
            <img loading="lazy" src={accommodation.details.rating_image_url} height="25" alt={accommodation.details.rating_image_url} />
          </Box>
          <br />
        </Box>
      </CardContent>
    </Card>
  </CardActionArea>
);

export default AccomodationCard;
