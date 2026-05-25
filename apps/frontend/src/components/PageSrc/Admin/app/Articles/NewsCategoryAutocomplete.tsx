import { FC } from "react";
import { AutocompleteArrayInput, useChoicesContext, useInput } from "react-admin";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import ResourceType from "../../entries/resourceType.entry";

const NewsCategoryAutocomplete: FC<{ disabled?: boolean }> = ({ disabled }) => {
  const {
    field: { value, onChange },
  } = useInput({ source: ResourceType.Categories });

  const { allChoices, availableChoices, isLoading } = useChoicesContext();

  if (!availableChoices || !allChoices || isLoading) {
    return (
      <Box sx={{ width: "100%", p: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  const fixedOptions = allChoices.filter((option) => option.slug === "news");

  return (
    <AutocompleteArrayInput
      disabled={disabled}
      optionText="name"
      defaultValue={fixedOptions.map((option) => option.id)}
      onChange={(event, newValue) => {
        const newValueIds = newValue.map((option) => option.id);
        const fixedOptionsToKeep = fixedOptions.filter((option) => !newValueIds.includes(option.id)).map((option) => option.id);
        onChange([...fixedOptionsToKeep, ...newValueIds]);
      }}
    />
  );
};

export default NewsCategoryAutocomplete;
