import React, { useState } from "react";
import { Box, Typography, RadioGroup } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useTranslations } from "next-intl";

interface ISwitchLanguageProps {
  defaultLanguage: string;
  languages: string[];
}

const SwitchLanguage: React.FC<ISwitchLanguageProps> = ({ defaultLanguage, languages }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const t = useTranslations();

  const handleSelectLanguage = (language: string) => {
    setSelectedLanguage(language);
  };

  return (
    <FormControl component="fieldset" sx={{ display: "grid", gap: "5px" }}>
      <Typography color="text.primary" fontSize={14} fontWeight={500}>
        {t("Template language")}
      </Typography>
      <RadioGroup
        aria-label="templateLanguage"
        name="templateLanguage"
        sx={{ display: "flex", flexDirection: "row", gap: "30px" }}
      >
        {languages.map((language) => (
          <Box
            key={language}
            sx={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              cursor: "pointer",
              color: selectedLanguage === language ? "#1BAA75" : "text.primary",
            }}
          >
            {selectedLanguage === language ? (
              <CheckCircleIcon fontSize="small" sx={{ color: "#1BAA75" }} />
            ) : (
              <RadioButtonUncheckedIcon
                fontSize="small"
                sx={{ color: "text.secondary" }}
                onClick={() => handleSelectLanguage(language)}
              />
            )}
            <Typography onClick={() => handleSelectLanguage(language)} fontSize={14} fontWeight={600}>
              {t(language)}
            </Typography>
          </Box>
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default SwitchLanguage;
