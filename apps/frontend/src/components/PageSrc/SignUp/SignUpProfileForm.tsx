"use client";

import { FC, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { styled } from "@mui/material/styles";
import useSWR, { Fetcher } from "swr";
import { useForm, Controller } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Select from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import stripText, { htmlEscape } from "@/utils/stripText";
import {
  AgeRangeEnum,
  AverageBudgetEnum,
  AverageStayDurationEnum,
  CountryEnum,
  FamilySituationEnum,
  GenderEnum,
  memberStringMapping,
  PreferredTravelPeriodEnum,
  TravelCompanionEnum,
  TravelFrequencyEnum,
} from "@/entries/memberEnums.entry";
import { staticStrings } from "@/types/staticStrings.type";
import StyledPopper from "@/components/Shared/Inputs/StyledPopper";
import AutocompleteListBoxReactWindow from "@/components/Shared/Inputs/AutocompleteListBoxReactWindow";
import fetchTextDebug from "@/utils/fetchTextDebug";
import { tag } from "@/types/tag.type";
import { categoryBase } from "@/types/category.type";
import { signUpForm } from "@/types/signUp.type";

type municipalityValueType = { id: string; name: string; url: string };

const fetcher: Fetcher<Array<municipalityValueType>, string> = (url: string) =>
  fetch(url, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(fetchTextDebug(url, response.status, response.statusText));
  });

const SubmitButton = styled(Button)(({ theme }) => ({
  boxShadow: "none",
  textTransform: "none",
  borderRadius: 8,
  backgroundColor: "primary.main",
  fontSize: 18,
}));

interface Props {
  locale: string;
  staticStrings: staticStrings;
  categoriesArticles: Array<categoryBase>;
  categoriesEvents: Array<categoryBase>;
  tags: Array<tag>;
  initialFormValues: signUpForm;
  userId?: string;
  isProfilePage?: boolean;
}

const SignUpForm: FC<Props> = ({ locale, staticStrings, categoriesArticles, categoriesEvents, tags, initialFormValues, userId, isProfilePage = false }) => {
  const router = useRouter();
  const {
    data: municipalitiesData,
    error: municipalitiesError,
    isLoading: municipalitiesIsLoading,
    mutate: municipalitiesMutate,
  } = useSWR(`/api/${locale}/municipalities-search`, fetcher);

  const [activeStep, setActiveStep] = useState<number>(0);
  const [activeStepError, setActiveStepError] = useState<number | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);


  const handleNext = async (value: number) => {
    // Trigger validation for current step
    const isValid = await trigger();

    if (isValid) {
      setActiveStep(value);
      setActiveStepError(undefined); // Clear any previous errors
    } else {
      // Set the error for the current step
      setActiveStepError(activeStep);
    }
  };

  const handleBack = (value: number) => {
    setActiveStep(value);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const { control, handleSubmit, setError, reset, watch, trigger } = useForm<signUpForm>({
    defaultValues: { ...initialFormValues },
  });

  const selectedCountry = watch("country");

  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Helper function to find which step contains the error fields
  const findStepForFields = (errorFields: string[]): number => {
    const step0Fields = ["firstName", "lastName", "email", "password", "confirmPassword", "municipality", "country"];
    const step1Fields = ["gender", "ageRange", "familySituation"];
    const step2Fields = ["travelInterests", "articleInterests", "eventsInterests"];
    const step3Fields = ["travelCompanion", "travelFrequency", "averageStay", "preferredTravelPeriod", "averageBudget"];
    const step4Fields = ["privacyConsent"];

    if (errorFields.some((field) => step0Fields.includes(field))) return 0;
    if (errorFields.some((field) => step1Fields.includes(field))) return 1;
    if (errorFields.some((field) => step2Fields.includes(field))) return 2;
    if (errorFields.some((field) => step3Fields.includes(field))) return 3;
    if (errorFields.some((field) => step4Fields.includes(field))) return 4;

    return 0; // Default to first step
  };

  const onSubmit = handleSubmit(async (data) => {
    const endpoint = isProfilePage && userId ? `/api/${locale}/me/profile/${userId}` : `/api/${locale}/me/register`;
    const method = isProfilePage ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password || undefined,
        confirmPassword: data.confirmPassword || undefined,
        phone: data.phone || undefined,
        country: data.country || undefined,
        municipality: data.municipality ? data.municipality.id : undefined,
        gender: data.gender || undefined,
        ageRange: data.ageRange || undefined,
        familySituation: data.familySituation || undefined,
        travelCompanion: data.travelCompanion || undefined,
        travelFrequency: data.travelFrequency || undefined,
        travelInterests: data.travelInterests,
        articleInterests: data.articleInterests,
        eventsInterests: data.eventsInterests,
        averageStay: data.averageStay || undefined,
        preferredTravelPeriod: data.preferredTravelPeriod || undefined,
        averageBudget: data.averageBudget || undefined,
        privacyConsent: data.privacyConsent,
      }),
    });

    if (!res.ok) {
      if (res.status === 422) {
        const responseData = await res.json();

        // Determine which step has errors
        const errorFields = Object.keys(responseData.errors);
        const stepWithError = findStepForFields(errorFields);

        setActiveStepError(stepWithError);
        setActiveStep(stepWithError); // Jump to the step with errors

        // Set field errors
        Object.keys(responseData.errors).forEach((item) => {
          setError(item as keyof signUpForm, { type: "custom", message: responseData.errors[item][0] });
        });
      }
    } else {
      setAlertMsg(isProfilePage ? "Profile updated successfully!" : "Registration successful! Please check your email to verify your account.");
      if (!isProfilePage) {
        reset({ ...initialFormValues });
      }
      setActiveStepError(undefined);
    }
  });

  const handleOpenDeleteDialog = () => {
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setDeleteError(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/${locale}/me/profile/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.message || "Failed to delete account");
        setIsDeleting(false);
        return;
      }

      await signOut({ redirect: false });
      router.push(`/${locale}`);
      router.refresh();
    } catch (error) {
      setDeleteError("An unexpected error occurred. Please try again.");
      setIsDeleting(false);
    }
  };

  const handleKeyDownDeleteDialog = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" && !isDeleting) {
      handleCloseDeleteDialog();
    }
  };

  return (
    <Grid component="form" onSubmit={onSubmit} container size={12} spacing={2}>
      {alertMsg && (
        <Grid size={12}>
          <Alert severity="success" onClose={() => setAlertMsg(null)} sx={{ mb: 2 }}>
            {alertMsg}
          </Alert>
        </Grid>
      )}
      <Grid size={12}>
        <Stepper activeStep={activeStep} orientation="vertical">
          <Step>
            <StepLabel error={activeStepError === 0}>{stripText(staticStrings.signupFormPersonalDataSection)}</StepLabel>
            <StepContent>
              <Grid container size={12} spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: stripText(staticStrings.validationFormInputMessageRequired) }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        value={value}
                        size="small"
                        onChange={onChange}
                        label={stripText(staticStrings.signupFormName)}
                        variant="outlined"
                        fullWidth
                        helperText={error?.message}
                        error={error !== undefined}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: stripText(staticStrings.validationFormInputMessageRequired) }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        value={value}
                        size="small"
                        onChange={onChange}
                        label={stripText(staticStrings.signupFormSurname)}
                        variant="outlined"
                        fullWidth
                        helperText={error?.message}
                        error={error !== undefined}
                      />
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: stripText(staticStrings.validationFormInputMessageRequired) }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        value={value}
                        size="small"
                        onChange={onChange}
                        label={stripText(staticStrings.signupFormEmail)}
                        variant="outlined"
                        fullWidth
                        helperText={error?.message}
                        error={error !== undefined}
                        slotProps={{
                          input: {
                            readOnly: isProfilePage,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                {!isProfilePage && (
                  <>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="password"
                        control={control}
                        rules={{ required: stripText(staticStrings.validationFormInputMessageRequired), minLength: 6 }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            value={value}
                            size="small"
                            onChange={onChange}
                            label={stripText(staticStrings.signupFormPassword)}
                            variant="outlined"
                            fullWidth
                            helperText={error?.message}
                            error={error !== undefined}
                            type="password"
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="confirmPassword"
                        control={control}
                        rules={{ required: stripText(staticStrings.validationFormInputMessageRequired), minLength: 6 }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            value={value}
                            size="small"
                            onChange={onChange}
                            label={stripText(staticStrings.signupFormConfirmPassword)}
                            variant="outlined"
                            fullWidth
                            helperText={error?.message}
                            error={error !== undefined}
                            type="password"
                          />
                        )}
                      />
                    </Grid>
                  </>
                )}

                <Grid size={12}>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        value={value}
                        size="small"
                        onChange={onChange}
                        label={stripText(staticStrings.signupFormPhone)}
                        variant="outlined"
                        fullWidth
                        helperText={error?.message}
                        error={error !== undefined}
                      />
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormControl size="small" fullWidth>
                        <InputLabel id="form-select-signup-country-label">{stripText(staticStrings.signupFormCountry)}</InputLabel>
                        <Select
                          labelId="form-select-signup-country-label"
                          id="form-select-signup-country-input"
                          value={value}
                          onChange={onChange}
                          label={stripText(staticStrings.signupFormCountry)}
                          error={error !== undefined}
                        >
                          {Object.values(CountryEnum).map((country) => (
                            <MenuItem key={country} value={country}>
                              {stripText(staticStrings[memberStringMapping[country]])}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                {selectedCountry === CountryEnum.ITALY && (
                  <Grid size={12}>
                    <Controller
                      name="municipality"
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Autocomplete
                          id="homepage-calendar-form-municipalities-autocomplete"
                          isOptionEqualToValue={(option, value) => option.name === value.name}
                          options={municipalitiesData || []}
                          getOptionLabel={(option) => option.name}
                          value={value}
                          loading={municipalitiesIsLoading}
                          onChange={(_event, newValue) => {
                            onChange(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              placeholder={stripText(staticStrings.signupFormMunicipality)}
                              helperText={error?.message}
                              error={error !== undefined}
                              size="small"
                            />
                          )}
                          disableListWrap
                          slotProps={{
                            popper: {
                              component: StyledPopper,
                            },
                            listbox: {
                              component: AutocompleteListBoxReactWindow,
                            },
                          }}
                          renderOption={(props, option, state) => [props, option.name, state.index] as ReactNode}
                          renderGroup={(params) => params as any}
                        />
                      )}
                    />
                  </Grid>
                )}
                <Grid size={12}>
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={() => handleNext(1)}>
                      {stripText(staticStrings.signupFormNextButton)}
                    </Button>
                    <Button disabled={activeStep === 0} onClick={() => handleBack(0)}>
                      {stripText(staticStrings.signupFormBackButton)}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </StepContent>
          </Step>
          <Step>
            <StepLabel error={activeStepError === 1}>{stripText(staticStrings.signupFormProfileSection)}</StepLabel>
            <StepContent>
              <Grid container size={12} spacing={2}>
                <Grid size={12}>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormControl>
                        <FormLabel>{stripText(staticStrings.signupFormGender)}</FormLabel>
                        <RadioGroup onChange={onChange}>
                          {Object.values(GenderEnum).map((gender) => (
                            <FormControlLabel
                              key={gender}
                              value={gender}
                              control={<Radio />}
                              label={stripText(staticStrings[memberStringMapping[gender]])}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    name="ageRange"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormControl>
                        <FormLabel>{stripText(staticStrings.signupFormAgeRange)}</FormLabel>
                        <RadioGroup onChange={onChange}>
                          {Object.values(AgeRangeEnum).map((ageRange) => (
                            <FormControlLabel
                              key={ageRange}
                              value={ageRange}
                              control={<Radio />}
                              label={stripText(staticStrings[memberStringMapping[ageRange]])}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    name="familySituation"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormControl>
                        <FormLabel>{stripText(staticStrings.signupFormFamilySituation)}</FormLabel>
                        <RadioGroup onChange={onChange}>
                          {Object.values(FamilySituationEnum).map((situation) => (
                            <FormControlLabel
                              key={situation}
                              value={situation}
                              control={<Radio />}
                              label={stripText(staticStrings[memberStringMapping[situation]])}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    name="travelCompanion"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormControl>
                        <FormLabel>{stripText(staticStrings.signupFormTravelCompanion)}</FormLabel>
                        <RadioGroup onChange={onChange}>
                          {Object.values(TravelCompanionEnum).map((companion) => (
                            <FormControlLabel
                              key={companion}
                              value={companion}
                              control={<Radio />}
                              label={stripText(staticStrings[memberStringMapping[companion]])}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={() => handleNext(2)}>
                      {stripText(staticStrings.signupFormNextButton)}
                    </Button>
                    <Button onClick={() => handleBack(0)}>{stripText(staticStrings.signupFormBackButton)}</Button>
                  </Stack>
                </Grid>
              </Grid>
            </StepContent>
          </Step>
          <Step>
            <StepLabel error={activeStepError === 2}>{stripText(staticStrings.signupFormTravelSection)}</StepLabel>
            <StepContent>
              <Grid container size={12} spacing={2}>
                <Grid size={12}>
                  <Controller
                    name="articleInterests"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormControl>
                        <FormLabel>{stripText(staticStrings.signupFormInterestsArticle)}</FormLabel>
                        <FormGroup>
                          {categoriesArticles.map((interest) => (
                            <FormControlLabel
                              key={interest.id}
                              control={
                                <Checkbox
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      onChange([...(value || []), interest.id]);
                                    } else {
                                      onChange((value || []).filter((i) => i !== interest.id));
                                    }
                                  }}
                                  checked={(value || []).includes(interest.id)}
                                />
                              }
                              label={stripText(interest.name)}
                            />
                          ))}
                        </FormGroup>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid size={12}>
                  <Controller
                    name="travelInterests"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormControl>
                        <FormLabel>{stripText(staticStrings.signupFormInterestsMap)}</FormLabel>
                        <FormGroup>
                          {tags.map((interest) => (
                            <FormControlLabel
                              key={interest.id}
                              control={
                                <Checkbox
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      onChange([...(value || []), interest.id]);
                                    } else {
                                      onChange((value || []).filter((i) => i !== interest.id));
                                    }
                                  }}
                                  checked={(value || []).includes(interest.id)}
                                />
                              }
                              label={stripText(interest.name)}
                            />
                          ))}
                        </FormGroup>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    name="eventsInterests"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormControl>
                        <FormLabel>{stripText(staticStrings.signupFormInterestsEvent)}</FormLabel>
                        <FormGroup>
                          {categoriesEvents.map((interest) => (
                            <FormControlLabel
                              key={interest.id}
                              control={
                                <Checkbox
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      onChange([...(value || []), interest.id]);
                                    } else {
                                      onChange((value || []).filter((i) => i !== interest.id));
                                    }
                                  }}
                                  checked={(value || []).includes(interest.id)}
                                />
                              }
                              label={stripText(interest.name)}
                            />
                          ))}
                        </FormGroup>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={() => handleNext(3)}>
                      {stripText(staticStrings.signupFormNextButton)}
                    </Button>
                    <Button onClick={() => handleBack(1)}>{stripText(staticStrings.signupFormBackButton)}</Button>
                  </Stack>
                </Grid>
              </Grid>
            </StepContent>
          </Step>
          <Step>
            <StepLabel error={activeStepError === 3}>{stripText(staticStrings.signupFormTravelHabits)}</StepLabel>
            <StepContent>
              <Grid container size={12} spacing={2}>
                <Grid size={12}>
                  <Controller
                    name="travelFrequency"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormControl>
                        <FormLabel>{stripText(staticStrings.signupFormTravelFrequency)}</FormLabel>
                        <RadioGroup onChange={onChange}>
                          {Object.values(TravelFrequencyEnum).map((frequency) => (
                            <FormControlLabel
                              key={frequency}
                              value={frequency}
                              control={<Radio />}
                              label={stripText(staticStrings[memberStringMapping[frequency]])}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    name="averageStay"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormControl>
                        <FormLabel>{stripText(staticStrings.signupFormAverageStay)}</FormLabel>
                        <RadioGroup onChange={onChange}>
                          {Object.values(AverageStayDurationEnum).map((duration) => (
                            <FormControlLabel
                              key={duration}
                              value={duration}
                              control={<Radio />}
                              label={stripText(staticStrings[memberStringMapping[duration]])}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid size={12}>
                  <Controller
                    name="preferredTravelPeriod"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormControl>
                        <FormLabel>{stripText(staticStrings.signupFormPreferredTravelPeriod)}</FormLabel>
                        <RadioGroup onChange={onChange}>
                          {Object.values(PreferredTravelPeriodEnum).map((period) => (
                            <FormControlLabel
                              key={period}
                              control={
                                <Checkbox
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      onChange([...(Object.values(value || [])), period]);
                                    } else {
                                      onChange((Object.values(value || [])).filter((i) => i !== period));
                                    }
                                  }}
                                  checked={Object.values(value || []).includes(period)}
                                />
                              }
                              label={stripText(staticStrings[memberStringMapping[period]])}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    name="averageBudget"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormControl>
                        <FormLabel>{stripText(staticStrings.signupFormAverageBudget)}</FormLabel>
                        <RadioGroup value={value} onChange={onChange}>
                          {Object.values(AverageBudgetEnum).map((budget) => (
                            <FormControlLabel
                              key={budget}
                              value={budget}
                              control={<Radio />}
                              label={htmlEscape(stripText(staticStrings[memberStringMapping[budget]]))}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={() => handleNext(4)}>
                      {stripText(staticStrings.signupFormNextButton)}
                    </Button>
                    <Button onClick={() => handleBack(2)}>{stripText(staticStrings.signupFormBackButton)}</Button>
                  </Stack>
                </Grid>
              </Grid>
            </StepContent>
          </Step>
          <Step>
            <StepLabel error={activeStepError === 4}>{stripText(staticStrings.signupFormConsentSection)}</StepLabel>
            <StepContent>
              <Grid container size={12} spacing={2}>
                {!isProfilePage && (
                  <Grid size={12}>
                    <Controller
                      name="privacyConsent"
                      control={control}
                      rules={{ required: stripText(staticStrings.validationFormInputMessageRequired) }}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <FormControl error={error !== undefined}>
                          <FormControlLabel
                            control={<Checkbox checked={value} onChange={(e) => onChange(e.target.checked)} />}
                            label={<Typography variant="body2">{stripText(staticStrings.signupFormPrivacyConsent, false)}</Typography>}
                          />
                          {error && (
                            <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                              {error.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                )}
                <Grid size={12}>
                  <Stack direction="row" spacing={2}>
                    <SubmitButton type="submit" variant="contained">
                      {stripText(staticStrings.registerBusinessFormButton)}
                    </SubmitButton>
                    <Button onClick={() => handleBack(3)}>{stripText(staticStrings.signupFormBackButton)}</Button>
                  </Stack>
                </Grid>
              </Grid>
            </StepContent>
          </Step>
        </Stepper>
      </Grid>
      {isProfilePage && userId && (
        <Grid size={12} sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Danger zone
          </Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleOpenDeleteDialog}
            aria-label="Delete account"
            tabIndex={0}
          >
            Delete account
          </Button>
        </Grid>
      )}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onKeyDown={handleKeyDownDeleteDialog}
        aria-labelledby="delete-account-dialog-title"
        aria-describedby="delete-account-dialog-description"
      >
        <DialogTitle id="delete-account-dialog-title">Delete account</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-account-dialog-description">
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }} onClose={() => setDeleteError(null)}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={isDeleting} aria-label="Cancel">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? undefined : <DeleteIcon />}
            aria-label="Confirm delete account"
          >
            {isDeleting ? "Deleting..." : "Delete account"}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default SignUpForm;
