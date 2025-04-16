import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  useTheme,
  Chip,
  Grid,
  CircularProgress,
  ButtonGroup,
  Button,
  Tabs,
  Tab,
  Avatar,
  alpha,
  Skeleton,
  Paper,
  Divider,
} from "@mui/material";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  CalendarToday,
  LocationOn,
  EmojiEvents,
  Event,
  Timer,
  SportsSoccer,
  SportsTennis,
  SportsBasketball,
  SportsVolleyball,
  SportsEsports,
  AccessTime,
  ChevronRight,
} from "@mui/icons-material";
import axios from "axios";
import { styled } from "@mui/material/styles";

// Custom styled components for more attractive cards
const StyledEventCard = styled(Card)(({ theme }) => ({
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  borderRadius: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
  "&:hover": {
    boxShadow: "0 16px 40px -12.125px rgba(0,0,0,0.25)",
  },
}));

const EventHeader = styled(Box)(({ theme, eventType }) => {
  const colors = {
    elevate: theme.palette.error.main,
    tournament: theme.palette.primary.main,
    intra: theme.palette.success.main,
    annual: theme.palette.warning.main,
    default: theme.palette.primary.main,
  };

  const color = colors[eventType?.toLowerCase()] || colors.default;
  const lightColor = alpha(color, 0.15);
  const midColor = alpha(color, 0.35);

  return {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "30%",
    overflow: "hidden",
    background: `linear-gradient(135deg, ${lightColor} 0%, ${midColor} 100%)`,
    boxShadow: "inset -10px 0px 20px -10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "@media (max-width: 900px)": {
      width: "100%",
      height: "140px",
      position: "relative",
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.2,
      background:
        eventType === "elevate"
          ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${color.slice(
              1
            )}' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          : eventType === "tournament"
          ? `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%23${color.slice(
              1
            )}' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`
          : eventType === "intra"
          ? `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${color.slice(
              1
            )}' fill-opacity='0.2'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          : `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${color.slice(
              1
            )}' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
    },
  };
});

const SportIconWrapper = styled(Box)(({ theme, sportColor }) => ({
  position: "relative",
  color: sportColor || alpha(theme.palette.text.primary, 0.3),
  opacity: 0.5,
  fontSize: 60,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  transition: "transform 0.5s ease-in-out",
  animation: "float 4s ease-in-out infinite",
  "@keyframes float": {
    "0%": {
      transform: "translateY(0)",
    },
    "50%": {
      transform: "translateY(-5px)",
    },
    "100%": {
      transform: "translateY(0)",
    },
  },
  "& > svg": {
    filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.15))",
  },
}));

const DateChip = styled(Box)(({ theme, eventType }) => {
  const colors = {
    elevate: theme.palette.error.main,
    tournament: theme.palette.primary.main,
    intra: theme.palette.success.main,
    annual: theme.palette.warning.main,
    default: theme.palette.primary.main,
  };

  const color = colors[eventType?.toLowerCase()] || colors.default;

  return {
    backgroundColor: alpha(theme.palette.background.paper, 0.95),
    color: color,
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(1.5),
    fontWeight: "bold",
    boxShadow: `0 4px 14px ${alpha(color, 0.5)}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderLeft: `4px solid ${color}`,
    transition: "all 0.3s ease",
    marginTop: theme.spacing(2),
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: `0 6px 18px ${alpha(color, 0.6)}`,
    },
  };
});

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  paddingLeft: "33%", // To accommodate the side header
  paddingRight: theme.spacing(4),
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  "@media (max-width: 900px)": {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: 0,
  },
}));

const ProgressDots = styled(Box)(({ theme, active }) => ({
  width: 12,
  height: 12,
  borderRadius: "50%",
  margin: "0 6px",
  backgroundColor: active
    ? theme.palette.primary.main
    : alpha(theme.palette.text.disabled, 0.3),
  transition: "all 0.3s ease",
  transform: active ? "scale(1.2)" : "scale(1)",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: active
      ? theme.palette.primary.main
      : alpha(theme.palette.text.disabled, 0.6),
  },
}));

// Helper function to get sport icon
const getSportIcon = (sport) => {
  if (!sport) return <SportsSoccer sx={{ fontSize: 70 }} />;

  const sportName = sport.toLowerCase();

  if (sportName.includes("cricket")) {
    return <SportsSoccer sx={{ fontSize: 70 }} />; // Using soccer for cricket as placeholder
  } else if (sportName.includes("basket")) {
    return <SportsBasketball sx={{ fontSize: 70 }} />;
  } else if (sportName.includes("volley")) {
    return <SportsVolleyball sx={{ fontSize: 70 }} />;
  } else if (sportName.includes("tennis") || sportName.includes("table")) {
    return <SportsTennis sx={{ fontSize: 70 }} />;
  } else if (sportName.includes("chess")) {
    return <SportsEsports sx={{ fontSize: 70 }} />;
  } else {
    return <SportsSoccer sx={{ fontSize: 70 }} />;
  }
};

const UpcomingEventsSlider = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0); // 0 = upcoming, 1 = recent
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();

    // Auto-advance slider every 7 seconds
    const interval = setInterval(() => {
      if (filteredEvents.length > 1) {
        handleNext();
      }
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // Update filtered events when tab changes or events are loaded
  useEffect(() => {
    if (events.length > 0) {
      filterEventsByTab();
    }
  }, [events, tabValue]);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/admin/events"
      );
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterEventsByTab = () => {
    const today = new Date();

    if (tabValue === 0) {
      // Upcoming events (future)
      const upcoming = events
        .filter((event) => new Date(event.startDate) >= today)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      setFilteredEvents(upcoming);
    } else {
      // Recent events (past)
      const recent = events
        .filter((event) => new Date(event.endDate) < today)
        .sort((a, b) => new Date(b.endDate) - new Date(a.endDate)); // Most recent first
      setFilteredEvents(recent);
    }

    // Reset the current index when changing tabs
    setCurrentIndex(0);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? filteredEvents.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === filteredEvents.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      elevate: "error",
      tournament: "primary",
      intra: "success",
      annual: "warning",
    };
    return colors[type?.toLowerCase()] || "default";
  };

  const getProgressSteps = () => {
    return Array.from({ length: filteredEvents.length }, (_, i) => (
      <Box
        key={i}
        sx={{
          width: 30,
          height: 4,
          backgroundColor:
            i === currentIndex
              ? theme.palette.primary.main
              : alpha(theme.palette.text.disabled, 0.3),
          mx: 0.5,
          borderRadius: 1,
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
        onClick={() => setCurrentIndex(i)}
      />
    ));
  };

  const renderSkeleton = () => (
    <Box sx={{ width: "100%", my: 4 }}>
      <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={240} />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width={30}
            height={4}
            sx={{ mx: 0.5 }}
          />
        ))}
      </Box>
    </Box>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (events.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          my: 3,
          py: 6,
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          borderRadius: 2,
        }}>
        <Event sx={{ fontSize: 40, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="textSecondary">
          No events found
        </Typography>
      </Box>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <Box sx={{ my: 3 }}>
        <Box sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="event tabs">
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CalendarToday sx={{ mr: 1, fontSize: 18 }} />
                  <Typography>Upcoming Events</Typography>
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <EmojiEvents sx={{ mr: 1, fontSize: 18 }} />
                  <Typography>Recent Events</Typography>
                </Box>
              }
            />
          </Tabs>
        </Box>

        <Box
          sx={{
            textAlign: "center",
            py: 6,
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            borderRadius: 2,
          }}>
          <Event sx={{ fontSize: 40, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            {tabValue === 0
              ? "No upcoming events found"
              : "No recent events found"}
          </Typography>
          {tabValue === 1 && (
            <Button
              variant="outlined"
              size="small"
              sx={{ mt: 2 }}
              onClick={() => setTabValue(0)}>
              View upcoming events
            </Button>
          )}
        </Box>
      </Box>
    );
  }
  return (
    <Box sx={{ width: "100%", my: 4 }}>
      <Box
        sx={{
          mb: 2,
          borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          pb: 1,
        }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              position: "relative",
              paddingBottom: 1,
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "40px",
                height: "4px",
                backgroundColor: theme.palette.primary.main,
                borderRadius: "2px",
              },
            }}>
            {tabValue === 0 ? "Upcoming Events" : "Recent Events"}
          </Typography>
          <Button
            size="small"
            color="primary"
            variant="outlined"
            endIcon={<ChevronRight />}
            onClick={() => navigate("/upcoming-events")}
            sx={{
              fontWeight: 600,
              borderRadius: "20px",
              textTransform: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}>
            View all events
          </Button>
        </Box>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="event tabs"
          sx={{
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              minWidth: 120,
            },
          }}>
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarToday sx={{ mr: 1, fontSize: 18 }} />
                <Typography>Upcoming Events</Typography>
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EmojiEvents sx={{ mr: 1, fontSize: 18 }} />
                <Typography>Recent Events</Typography>
              </Box>
            }
          />
        </Tabs>
      </Box>

      <StyledEventCard elevation={4}>
        {/* Modern side navigation controls */}
        {filteredEvents.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: "absolute",
                left: { xs: 8, md: "32%" },
                top: { xs: "140px", md: "50%" },
                transform: {
                  xs: "none",
                  md: "translateY(-50%) translateX(-50%)",
                },
                bgcolor: "background.paper",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                zIndex: 5,
                width: "40px",
                height: "40px",
                "&:hover": {
                  bgcolor: "background.paper",
                  transform: {
                    xs: "scale(1.1)",
                    md: "translateY(-50%) translateX(-50%) scale(1.1)",
                  },
                },
                transition: "all 0.2s ease",
              }}>
              <KeyboardArrowLeft />
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: 16,
                top: { xs: "140px", md: "50%" },
                transform: { xs: "none", md: "translateY(-50%)" },
                bgcolor: "background.paper",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                zIndex: 5,
                width: "40px",
                height: "40px",
                "&:hover": {
                  bgcolor: "background.paper",
                  transform: {
                    xs: "scale(1.1)",
                    md: "translateY(-50%) scale(1.1)",
                  },
                },
                transition: "all 0.2s ease",
              }}>
              <KeyboardArrowRight />
            </IconButton>
          </>
        )}

        {/* Side header with pattern and icon */}
        <EventHeader eventType={filteredEvents[currentIndex]?.type}>
          {filteredEvents[currentIndex]?.sports && (
            <SportIconWrapper>
              {getSportIcon(filteredEvents[currentIndex].sports[0])}
            </SportIconWrapper>
          )}

          <DateChip eventType={filteredEvents[currentIndex]?.type}>
            <Typography variant="caption" fontWeight={600}>
              {new Date(
                filteredEvents[currentIndex]?.startDate
              ).toLocaleDateString("en-US", { month: "short" })}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1 }}>
              {new Date(filteredEvents[currentIndex]?.startDate).getDate()}
            </Typography>
          </DateChip>
        </EventHeader>

        {/* Content section */}
        <StyledCardContent>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
              {filteredEvents[currentIndex]?.type && (
                <Chip
                  label={filteredEvents[currentIndex].type.toUpperCase()}
                  color={getEventTypeColor(filteredEvents[currentIndex].type)}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    letterSpacing: "0.5px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                    },
                  }}
                />
              )}
              {filteredEvents[currentIndex]?.brochureUrl && (
                <Chip
                  label="Brochure"
                  color="info"
                  size="small"
                  sx={{
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                    },
                  }}
                  onClick={() =>
                    window.open(filteredEvents[currentIndex].brochureUrl)
                  }
                />
              )}
              <Chip
                label={
                  tabValue === 0
                    ? `Starting ${formatDate(
                        filteredEvents[currentIndex].startDate
                      )}`
                    : `Held on ${formatDate(
                        filteredEvents[currentIndex].startDate
                      )}`
                }
                size="small"
                variant="outlined"
                icon={<CalendarToday fontSize="small" />}
                sx={{
                  backgroundColor: alpha(theme.palette.background.default, 0.4),
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.7
                    ),
                  },
                }}
              />
            </Box>
          </Box>

          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              mb: 2,
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -8,
                left: 0,
                width: "60px",
                height: "3px",
                backgroundColor: (theme) =>
                  getEventTypeColor(filteredEvents[currentIndex]?.type) ===
                  "default"
                    ? theme.palette.primary.main
                    : theme.palette[
                        getEventTypeColor(filteredEvents[currentIndex]?.type)
                      ].main,
                borderRadius: "2px",
              },
            }}>
            {filteredEvents[currentIndex].title}
          </Typography>

          <Typography
            variant="body1"
            paragraph
            sx={{
              textAlign: "left",
              fontSize: "1.05rem",
              lineHeight: 1.6,
              color: alpha(theme.palette.text.primary, 0.85),
              mb: 3,
              maxHeight: "7.8rem",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}>
            {filteredEvents[currentIndex].description}
          </Typography>

          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  py: 1.2,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: alpha(theme.palette.primary.light, 0.05),
                  borderRadius: "12px",
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.light, 0.1),
                    transform: "translateY(-2px)",
                  },
                }}>
                <CalendarToday sx={{ mr: 1.5, color: "primary.main" }} />
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500, fontSize: "0.75rem" }}>
                    {tabValue === 0 ? "EVENT DATE" : "TOOK PLACE ON"}
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {formatDate(filteredEvents[currentIndex].startDate)}
                    {filteredEvents[currentIndex].startDate !==
                      filteredEvents[currentIndex].endDate &&
                      ` - ${formatDate(filteredEvents[currentIndex].endDate)}`}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  py: 1.2,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: alpha(theme.palette.primary.light, 0.05),
                  borderRadius: "12px",
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.light, 0.1),
                    transform: "translateY(-2px)",
                  },
                }}>
                <LocationOn sx={{ mr: 1.5, color: "primary.main" }} />
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500, fontSize: "0.75rem" }}>
                    VENUE
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {filteredEvents[currentIndex].venue}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {filteredEvents[currentIndex].sports &&
              filteredEvents[currentIndex].sports.map((sport) => (
                <Chip
                  key={sport}
                  label={sport}
                  variant="outlined"
                  size="small"
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.light, 0.08),
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.light, 0.15),
                      transform: "scale(1.05)",
                    },
                  }}
                />
              ))}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => navigate("/upcoming-events")}
              endIcon={<ChevronRight />}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: 600,
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}>
              View details
            </Button>
          </Box>
        </StyledCardContent>
      </StyledEventCard>

      {filteredEvents.length > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          {getProgressSteps()}
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/upcoming-events")}
          endIcon={<KeyboardArrowRight />}>
          View all events
        </Button>
      </Box>
    </Box>
  );
};

export default UpcomingEventsSlider;
