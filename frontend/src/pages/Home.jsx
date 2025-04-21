import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
} from "@mui/material";
import {
  EmojiEvents,
  SportsTennis,
  School,
  Person,
  Groups,
} from "@mui/icons-material";
import UpcomingEventsSlider from "../components/UpcomingEventsSlider";
import SportsFacilities from "../components/SportsFacilities";
import ContactForm from "../components/ContactForm";
import CountUp from "react-countup";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Achievement section helper function
const getLevelColor = (level) => {
  const colors = {
    "Khelo India": "#00a693",
    "All India Inter University": "#FF0000",
    "Southwest Zone": "#CD7F32",
    "Division Level": "#4CAF50",
    "City Level": "#2196F3",
  };
  return colors[level] || "#1976d2";
};

const getAchievementIcon = (type) => {
  switch (type) {
    case "individual":
      return <Person />;
    case "team":
      return <Groups />;
    default:
      return <EmojiEvents />;
  }
};

const Home = () => {
  // State to store recent achievements
  const [recentAchievements, setRecentAchievements] = useState([
    {
      sport: "Basketball",
      type: "team",
      position: "Champions",
      level: "Khelo India",
      year: "2025",
    },
    {
      sport: "Athletics",
      type: "individual",
      studentName: "Rahul Sharma",
      position: "Gold Medal - 100m Sprint",
      level: "All India Inter University",
      year: "2025",
    },
    {
      sport: "Chess",
      type: "individual",
      studentName: "Aditya Kumar",
      position: "Champion",
      level: "Southwest Zone",
      year: "2025",
    },
  ]);

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: "relative",
          backgroundColor: "grey.500",
          color: "#fff",
          mb: 4,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundImage: `url(/images/hero-bg.jpg)`,
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,.4)",
          },
        }}>
        <Box
          sx={{
            position: "relative",
            textAlign: "center",
            p: { xs: 3, md: 6 },
          }}>
          <Typography component="h1" variant="h2" color="inherit" gutterBottom>
            Department of Physical Education & Sports
          </Typography>
          <Typography variant="h5" color="inherit" paragraph>
            Nurturing Champions, Building Character Through Sports Excellence
          </Typography>
        </Box>
      </Paper>

      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          {/* <Typography variant="h3" component="h1" gutterBottom align="center">
           
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom align="center">
            Your one-stop destination for sports events and achievements
          </Typography> */}
        </Box>
        {/* Events Slider Section */}
        <Box sx={{ mb: 6 }}>
          <UpcomingEventsSlider />
        </Box>

        {/* Recent Achievements Section */}
        <Box sx={{ mb: 8, mt: 10 }}>
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: "bold" }}>
              Recent Achievements
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: "700px", mx: "auto", mb: 3 }}>
              Celebrating excellence and dedication in sports across multiple
              disciplines and competitions
            </Typography>
          </Box>

          {/* Stats Counters */}
          <Box sx={{ mb: 6 }}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <School sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                  <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                    <CountUp
                      start={0}
                      end={50}
                      duration={2.5}
                      separator=","
                      useEasing={true}>
                      {({ countUpRef }) => <span ref={countUpRef} />}
                    </CountUp>
                    +
                  </Typography>
                  <Typography variant="body1">
                    Participating Colleges
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <EmojiEvents sx={{ fontSize: 40, color: "#FFD700", mb: 1 }} />
                  <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                    <CountUp
                      start={0}
                      end={175}
                      duration={2.5}
                      separator=","
                      useEasing={true}>
                      {({ countUpRef }) => <span ref={countUpRef} />}
                    </CountUp>
                    +
                  </Typography>
                  <Typography variant="body1">Total Achievements</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <SportsTennis
                    sx={{ fontSize: 40, color: "secondary.main", mb: 1 }}
                  />
                  <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                    <CountUp
                      start={0}
                      end={12}
                      duration={2.5}
                      separator=","
                      useEasing={true}>
                      {({ countUpRef }) => <span ref={countUpRef} />}
                    </CountUp>
                  </Typography>
                  <Typography variant="body1">Sports Categories</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Achievement Cards */}
          <Grid container spacing={4}>
            {recentAchievements.map((achievement, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 8,
                    },
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflow: "visible",
                  }}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: -15,
                      right: 20,
                      backgroundColor: getLevelColor(achievement.level),
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "15px",
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                      boxShadow: 2,
                    }}>
                    {achievement.level}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, pt: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: getLevelColor(achievement.level),
                          mr: 2,
                        }}>
                        {getAchievementIcon(achievement.type)}
                      </Avatar>
                      <Typography variant="h5" component="h3">
                        {achievement.sport}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      {achievement.position}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      gutterBottom>
                      {achievement.type === "individual"
                        ? achievement.studentName
                        : "Team Achievement"}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                      }}>
                      <Chip
                        label={
                          achievement.type === "team" ? "Team" : "Individual"
                        }
                        size="small"
                        color={
                          achievement.type === "team" ? "secondary" : "primary"
                        }
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {achievement.year}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* View More Link */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Link
              to="/achievements"
              style={{
                display: "inline-block",
                padding: "10px 25px",
                backgroundColor: "#1976d2",
                color: "white",
                borderRadius: "25px",
                textDecoration: "none",
                boxShadow: "0px 3px 5px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }>
              View All Achievements
            </Link>
          </Box>
        </Box>

        {/* Sports Facilities Section */}
        <SportsFacilities />
        {/* Contact Form Section */}
        <ContactForm />
      </Container>
    </Box>
  );
};

export default Home;
