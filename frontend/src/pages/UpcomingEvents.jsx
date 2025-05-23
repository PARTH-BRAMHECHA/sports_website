import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Box,
  Chip,
  Paper,
  Divider,
  Button,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  useTheme,
  alpha,
  useMediaQuery,
  Collapse,
  Fade,
} from "@mui/material";
import {
  CalendarToday,
  LocationOn,
  AccessTime,
  Event,
  EmojiEvents,
  SportsSoccer,
  SportsTennis,
  SportsBasketball,
  SportsVolleyball,
  SportsEsports,
  SportsRugby,
  SportsHockey,
  ChevronRight,
  GetApp,
  LocalFireDepartment,
  Sports,
} from "@mui/icons-material";
import axios from "axios";
import { styled } from "@mui/material/styles";

// Custom styled components
const HeroSection = styled("div")(({ theme }) => ({
  position: "relative",
  height: "280px",
  background: `linear-gradient(135deg, ${
    theme.palette.primary.dark
  } 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  marginBottom: theme.spacing(5),
  borderRadius: theme.spacing(1),
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjZmZmZmZmMDgiPjwvcmVjdD4KPHBhdGggZD0iTTI4IDY2TDAgNTBMMCAxNkwyOCAwTDU2IDE2TDU2IDUwTDI4IDY2TDI4IDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmMTAiIHN0cm9rZS13aWR0aD0iMiI+PC9wYXRoPgo8cGF0aCBkPSJNMjggMEwyOCAzNEw1NiA1MEw1NiAxNkwyOCAweiIgZmlsbD0iI2ZmZmZmZjA4IiBzdHJva2U9IiNmZmZmZmYxMCIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+Cjwvc3ZnPg==')",
    opacity: 0.2,
  },
}));

const EventCard = styled(Card)(({ theme }) => ({
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflow: "visible",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 16px 40px -12.125px rgba(0,0,0,0.3)",
  },
  borderRadius: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: (props) =>
      `linear-gradient(90deg, ${
        theme.palette[getEventTypeDetails(props.eventType).color].main
      } 0%, ${alpha(
        theme.palette[getEventTypeDetails(props.eventType).color].main,
        0.5
      )} 100%)`,
    borderTopLeftRadius: theme.spacing(2),
    borderTopRightRadius: theme.spacing(2),
  },
}));

const CardActionArea = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: "100%",
  zIndex: 1,
  cursor: "pointer",
}));

const CategoryBadge = styled(Chip)(({ theme, eventType }) => {
  const colors = {
    elevate: theme.palette.error.main,
    tournament: theme.palette.primary.main,
    intra: theme.palette.success.main,
    annual: theme.palette.warning.main,
  };

  const color = colors[eventType] || theme.palette.primary.main;

  return {
    position: "absolute",
    top: -12,
    right: 20,
    fontWeight: "bold",
    boxShadow: `0 4px 12px ${alpha(color, 0.5)}`,
    backgroundColor: color,
    color: "#fff",
    zIndex: 3,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    fontSize: "0.7rem",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  };
});

// Create styled component for event title in top right corner
const EventTitleBadge = styled(Box)(({ theme, eventType }) => {
  const colors = {
    elevate: theme.palette.error.main,
    tournament: theme.palette.primary.main,
    intra: theme.palette.success.main,
    annual: theme.palette.warning.main,
    default: theme.palette.primary.main,
  };

  const color = colors[eventType] || colors.default;

  return {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: alpha(theme.palette.background.paper, 0.95),
    color: color,
    padding: theme.spacing(0.7, 1.5),
    borderRadius: theme.spacing(1.5),
    fontWeight: "bold",
    zIndex: 1,
    maxWidth: "60%",
    boxShadow: `0 4px 14px ${alpha(color, 0.5)}`,
    borderRight: `4px solid ${color}`,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: `0 6px 18px ${alpha(color, 0.6)}`,
    },
  };
});

const SportIconWrapper = styled(Box)(({ theme, sportColor }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  color: sportColor || alpha(theme.palette.text.primary, 0.3),
  opacity: 0.5,
  fontSize: 60,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "transform 0.5s ease-in-out",
  animation: "float 4s ease-in-out infinite",
  "@keyframes float": {
    "0%": {
      transform: "translate(-50%, -50%)",
    },
    "50%": {
      transform: "translate(-50%, -55%)",
    },
    "100%": {
      transform: "translate(-50%, -50%)",
    },
  },
  "& > svg": {
    filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.15))",
  },
}));

const EventHeader = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: (props) =>
    alpha(theme.palette[getEventTypeDetails(props.eventType).color].main, 0.05),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
}));

const DateDisplay = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  background: alpha(theme.palette.background.paper, 0.8),
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
}));

const CountdownTimer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  background: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

const SportChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  "& .MuiChip-icon": {
    display: "none",
  },
}));

// Tab panel component for event categories
const EventTabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`event-tabpanel-${index}`}
      aria-labelledby={`event-tab-${index}`}
      {...other}>
      {value === index && (
        <Fade in={value === index} timeout={500}>
          <Box sx={{ py: 3 }}>{children}</Box>
        </Fade>
      )}
    </div>
  );
};

const UpcomingEvents = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // Trigger animation after data is loaded
    if (!loading) {
      setAnimateCards(true);
    }
  }, [loading]);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/events`
      );
      // Sort events by date
      const sortedEvents = data.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );
      setEvents(sortedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format date strings
  const formatDate = (dateString, short = false) => {
    if (short) {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get month abbreviation
  const getMonthAbbr = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short" });
  };

  // Get day of month
  const getDayOfMonth = (dateString) => {
    return new Date(dateString).getDate();
  };

  // Calculate days until event
  const getDaysUntil = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `${diffDays} days`;
  };

  // Get event type details
  const getEventTypeDetails = (type) => {
    const types = {
      elevate: {
        label: "ELEVATE",
        color: "error",
        icon: <EmojiEvents fontSize="small" />,
      },
      tournament: {
        label: "Tournament",
        color: "primary",
        icon: <SportsTennis fontSize="small" />,
      },
      intra: {
        label: "Intra-College",
        color: "success",
        icon: <Event fontSize="small" />,
      },
      annual: {
        label: "Annual Event",
        color: "warning",
        icon: <CalendarToday fontSize="small" />,
      },
    };

    return (
      types[type] || {
        label: type,
        color: "default",
        icon: <Event fontSize="small" />,
      }
    );
  };

  // Get sport icon based on sport name
  const getSportIcon = (sport) => {
    if (!sport) return <SportsSoccer sx={{ fontSize: 70 }} />;

    const sportName = sport.toLowerCase();

    if (sportName.includes("cricket")) {
      return <SportsRugby sx={{ fontSize: 70 }} />;
    } else if (sportName.includes("basket")) {
      return <SportsBasketball sx={{ fontSize: 70 }} />;
    } else if (sportName.includes("volley")) {
      return <SportsVolleyball sx={{ fontSize: 70 }} />;
    } else if (sportName.includes("tennis") || sportName.includes("table")) {
      return <SportsTennis sx={{ fontSize: 70 }} />;
    } else if (sportName.includes("chess")) {
      return <SportsEsports sx={{ fontSize: 70 }} />;
    } else if (sportName.includes("hockey")) {
      return <SportsHockey sx={{ fontSize: 70 }} />;
    } else {
      return <SportsSoccer sx={{ fontSize: 70 }} />;
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Group events by type for tabs
  const eventsByType = events.reduce(
    (acc, event) => {
      const type = event.type || "other";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(event);
      return acc;
    },
    { upcoming: [] }
  );

  // Add upcoming events (next 30 days) to a special category
  events.forEach((event) => {
    const eventDate = new Date(event.startDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    if (eventDate >= today && eventDate <= thirtyDaysFromNow) {
      eventsByType.upcoming.push(event);
    }
  });

  // Create array of tab data
  const tabData = [
    { key: "upcoming", label: "Next 30 Days", events: eventsByType.upcoming },
    ...Object.keys(eventsByType)
      .filter((key) => key !== "upcoming")
      .map((key) => ({
        key,
        label: getEventTypeDetails(key).label,
        events: eventsByType[key],
      })),
  ];

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <>
      <HeroSection>
        <Box sx={{ textAlign: "center", zIndex: 2, px: 3 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              textShadow: "2px 2px 8px rgba(0,0,0,0.2)",
            }}>
            Upcoming Events
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: 800,
              mx: "auto",
              textShadow: "1px 1px 4px rgba(0,0,0,0.2)",
            }}>
            Stay updated with all the exciting sports events happening at our
            campus
          </Typography>
        </Box>
      </HeroSection>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        {/* Tab navigation */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            position: "sticky",
            top: { xs: 56, sm: 64 },
            zIndex: 10,
            mb: 4,
            backgroundColor: (theme) =>
              alpha(theme.palette.background.paper, 0.9),
            backdropFilter: "blur(8px)",
          }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            textColor="primary"
            indicatorColor="primary"
            sx={{ px: 2 }}>
            {tabData.map((tab, index) => (
              <Tab
                key={tab.key}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {getEventTypeDetails(tab.key).icon}
                    <Typography component="span" fontWeight={500}>
                      {tab.label}
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          ml: 0.5,
                          bgcolor: "primary.main",
                          color: "white",
                          py: 0.3,
                          px: 0.8,
                          borderRadius: 10,
                        }}>
                        {tab.events.length}
                      </Typography>
                    </Typography>
                  </Box>
                }
                id={`event-tab-${index}`}
                aria-controls={`event-tabpanel-${index}`}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Tab panels with event cards */}
        {tabData.map((tab, index) => (
          <EventTabPanel key={tab.key} value={tabValue} index={index}>
            {tab.events.length > 0 ? (
              <Grid container spacing={3}>
                {tab.events.map((event, eventIndex) => {
                  // Determine primary sport and get its icon
                  const primarySport =
                    event.sports && event.sports.length > 0
                      ? event.sports[0]
                      : null;
                  const sportIcon = getSportIcon(primarySport);

                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={event._id || eventIndex}
                      sx={{
                        opacity: animateCards ? 1 : 0,
                        transform: animateCards
                          ? "translateY(0)"
                          : "translateY(20px)",
                        transition: `all 0.5s ease ${eventIndex * 0.1}s`,
                      }}>
                      <EventCard elevation={3} eventType={event.type}>
                        <EventHeader eventType={event.type}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}>
                            {getEventTypeDetails(event.type).icon}
                            <Typography variant="subtitle1" fontWeight={600}>
                              {getEventTypeDetails(event.type).label}
                            </Typography>
                          </Box>
                          <DateDisplay>
                            <Typography
                              variant="caption"
                              color="text.secondary">
                              {getMonthAbbr(event.startDate)}
                            </Typography>
                            <Typography variant="h5" fontWeight={700}>
                              {getDayOfMonth(event.startDate)}
                            </Typography>
                          </DateDisplay>
                        </EventHeader>

                        <CardContent sx={{ pt: 2, pb: 1 }}>
                          <Box
                            sx={{
                              mb: 1.5,
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              backgroundColor: alpha(
                                theme.palette.background.default,
                                0.1
                              ),
                              p: 1,
                              borderRadius: 1,
                            }}>
                            <Box sx={{ textAlign: "center" }}>
                              <Typography
                                variant="caption"
                                color="text.secondary">
                                Start Date
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {formatDate(event.startDate, true)}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                width: "1px",
                                height: "24px",
                                backgroundColor: alpha(
                                  theme.palette.divider,
                                  0.2
                                ),
                              }}
                            />
                            <Box sx={{ textAlign: "center" }}>
                              <Typography
                                variant="caption"
                                color="text.secondary">
                                End Date
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {formatDate(event.endDate, true)}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              mb: 1.5,
                              padding: "12px 16px",
                              backgroundColor: (theme) =>
                                alpha(theme.palette.primary.main, 0.05),
                              borderRadius: "8px",
                              position: "relative",
                              minHeight: "80px",
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: "4px",
                                backgroundColor: (theme) =>
                                  theme.palette.primary.main,
                                borderTopLeftRadius: "8px",
                                borderBottomLeftRadius: "8px",
                              },
                              "&:hover": {
                                backgroundColor: (theme) =>
                                  alpha(theme.palette.primary.main, 0.08),
                                transform: "translateX(4px)",
                                transition: "all 0.3s ease",
                              },
                            }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                maxWidth: "90%",
                                paddingLeft: "8px",
                              }}>
                              <EmojiEvents
                                sx={{
                                  color: (theme) => theme.palette.primary.main,
                                  fontSize: "1.25rem",
                                  transform: "scale(1.2)",
                                }}
                              />
                              <Typography
                                variant="h5"
                                component="h2"
                                sx={{
                                  fontWeight: 700,
                                  display: "-webkit-box",
                                  overflow: "hidden",
                                  WebkitBoxOrient: "vertical",
                                  WebkitLineClamp: 2,
                                  lineHeight: 1.4,
                                  color: (theme) => theme.palette.primary.main,
                                  margin: 0,
                                  textAlign: "center",
                                  fontSize: "1.25rem",
                                }}>
                                {event.title}
                              </Typography>
                            </Box>
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              overflow: "hidden",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 2,
                              mb: 1.5,
                            }}>
                            {event.description}
                          </Typography>

                          {event.sports && event.sports.length > 0 && (
                            <Box sx={{ mb: 1.5 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Sports & Activities:
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}>
                                {event.sports.map((sport) => (
                                  <SportChip
                                    key={sport}
                                    label={sport}
                                    size="small"
                                    sx={{
                                      backgroundColor: alpha(
                                        theme.palette.primary.light,
                                        0.1
                                      ),
                                      color: theme.palette.primary.main,
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                        </CardContent>

                        <CardActions
                          sx={{
                            mt: "auto",
                            p: 1.5,
                            borderTop: `1px solid ${alpha(
                              theme.palette.divider,
                              0.08
                            )}`,
                          }}>
                          {event.brochureUrl && (
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              startIcon={<GetApp />}
                              onClick={() =>
                                window.open(event.brochureUrl, "_blank")
                              }
                              sx={{
                                borderRadius: "20px",
                                textTransform: "none",
                                fontWeight: 600,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                },
                              }}>
                              Brochure
                            </Button>
                          )}
                        </CardActions>
                      </EventCard>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Paper
                elevation={1}
                sx={{
                  p: 4,
                  textAlign: "center",
                  backgroundColor: (theme) =>
                    alpha(theme.palette.background.paper, 0.7),
                  borderRadius: 2,
                }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No {tab.label.toLowerCase()} events found
                </Typography>
                <Typography color="text.secondary">
                  Check back later for updates or browse other categories.
                </Typography>
              </Paper>
            )}
          </EventTabPanel>
        ))}
      </Container>
    </>
  );
};

export default UpcomingEvents;
