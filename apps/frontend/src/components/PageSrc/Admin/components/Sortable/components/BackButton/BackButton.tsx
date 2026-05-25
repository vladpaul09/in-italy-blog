import { FC } from "react";
import { Button, useResourceContext, useTranslate } from "react-admin";
import { Link } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackButton: FC = () => {
  const resource = useResourceContext();
  const translate = useTranslate();

  return (
    <Button component={Link} to={`/${resource}`} label={translate("ra.action.back")}>
      <ArrowBackIcon />
    </Button>
  )
}

export default BackButton;