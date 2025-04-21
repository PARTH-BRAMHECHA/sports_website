import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  useTheme,
  alpha,
  InputAdornment,
  Fade,
  Slide,
  Zoom,
} from "@mui/material";
import {
  Person,
  Phone,
  Email,
  School,
  Sports,
  Message,
  Send,
  SportsSoccer,
  SportsBasketball,
  SportsTennis,
  SportsVolleyball,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  backdropFilter: "blur(8px)",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(2),
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: alpha(theme.palette.background.paper, 0.9),
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
    "&.Mui-focused": {
      backgroundColor: alpha(theme.palette.background.paper, 0.95),
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.text.secondary,
  },
}));

const SportIcon = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  marginRight: theme.spacing(1),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

const ShowInterest = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    prn: "",
    interests: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <Box sx={{ py: 8, position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 50%)`,
          zIndex: -1,
        }}
      />
      
      <Fade in timeout={1000}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 6,
            textAlign: "center",
            fontWeight: 700,
            position: "relative",
            color: theme.palette.primary.main,
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 60,
              height: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: 2,
            },
          }}>
          Show Your Interest
        </Typography>
      </Fade>

      <Slide direction="up" in timeout={800}>
        <StyledPaper elevation={3}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Left side - Personal Information */}
              <Grid item xs={12} md={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="PRN Number"
                      name="prn"
                      value={formData.prn}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <School sx={{ color: theme.palette.primary.main }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone sx={{ color: theme.palette.primary.main }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: theme.palette.primary.main }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Right side - Additional Information */}
              <Grid item xs={12} md={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: theme.palette.primary.main }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Select Your Interests
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {["Football", "Basketball", "Tennis", "Volleyball"].map((sport) => (
                          <motion.div
                            key={sport}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <SportIcon>
                              {sport === "Football" && <SportsSoccer />}
                              {sport === "Basketball" && <SportsBasketball />}
                              {sport === "Tennis" && <SportsTennis />}
                              {sport === "Volleyball" && <SportsVolleyball />}
                            </SportIcon>
                          </motion.div>
                        ))}
                      </Box>
                    </Box>
                    <StyledTextField
                      fullWidth
                      label="Interests"
                      name="interests"
                      value={formData.interests}
                      onChange={handleChange}
                      multiline
                      rows={2}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Sports sx={{ color: theme.palette.primary.main }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Message sx={{ color: theme.palette.primary.main }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Zoom in timeout={1000}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      endIcon={<Send />}
                      sx={{
                        px: 6,
                        py: 1.5,
                        borderRadius: 3,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
                        "&:hover": {
                          background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                          transform: "translateY(-2px)",
                          boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                        },
                        transition: "all 0.3s ease",
                      }}>
                      Submit Interest
                    </Button>
                  </Zoom>
                </Box>
              </Grid>
            </Grid>
          </form>
        </StyledPaper>
      </Slide>
    </Box>
  );
};

export default ShowInterest; 