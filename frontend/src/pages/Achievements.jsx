import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Paper,
  CircularProgress,
  ButtonGroup,
  Button,
} from "@mui/material";
import { EmojiEvents, Groups, Person } from "@mui/icons-material";
import CountUp from "react-countup";
import axios from "axios";

// Static achievements data including data for 2025
const staticAchievements = [
  {
    level: "Khelo India",
    achievements: [
      {
        sport: "Basketball",
        type: "team",
        studentName: "",
        position: "Champions",
        year: "2025",
      },
      {
        sport: "Athletics",
        type: "individual",
        studentName: "Rahul Sharma",
        position: "Gold Medal - 100m Sprint",
        year: "2025",
      },
      {
        sport: "Table Tennis",
        type: "individual",
        studentName: "Priya Patel",
        position: "Silver Medal",
        year: "2025",
      },
    ],
  },
  {
    level: "All India Inter University",
    achievements: [
      {
        sport: "Chess",
        type: "individual",
        studentName: "Aditya Kumar",
        position: "Champion",
        year: "2025",
      },
      {
        sport: "Cricket",
        type: "team",
        studentName: "",
        position: "Runners Up",
        year: "2025",
      },
      {
        sport: "Volleyball",
        type: "team",
        studentName: "",
        position: "Semi-Finalists",
        year: "2025",
      },
    ],
  },
  {
    level: "Southwest Zone",
    achievements: [
      {
        sport: "Basketball",
        type: "individual",
        studentName: "Ramesh Joshi",
        position: "Best Player",
        year: "2025",
      },
      {
        sport: "Table Tennis",
        type: "team",
        studentName: "",
        position: "Champions",
        year: "2025",
      },
      {
        sport: "Athletics",
        type: "individual",
        studentName: "Anjali Singh",
        position: "Gold Medal - Long Jump",
        year: "2025",
      },
    ],
  },
  {
    level: "Division Level",
    achievements: [
      {
        sport: "Carrom",
        type: "individual",
        studentName: "Suresh Desai",
        position: "Champion",
        year: "2025",
      },
      {
        sport: "Volleyball",
        type: "individual",
        studentName: "Kavita Patil",
        position: "Best Spiker",
        year: "2025",
      },
      {
        sport: "Cricket",
        type: "individual",
        studentName: "Ravi Verma",
        position: "Best Bowler",
        year: "2025",
      },
    ],
  },
  {
    level: "City Level",
    achievements: [
      {
        sport: "Athletics",
        type: "team",
        studentName: "",
        position: "Overall Champions",
        year: "2025",
      },
      {
        sport: "Chess",
        type: "individual",
        studentName: "Neha Gupta",
        position: "Champion",
        year: "2025",
      },
      {
        sport: "Basketball",
        type: "team",
        studentName: "",
        position: "Champions",
        year: "2025",
      },
    ],
  },
];

const AchievementCard = ({ level, achievements, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);

  const getLevelColor = (level) => {
    const colors = {
      "Khelo India": "#00a693",
      "All India Inter University": "#FF0000",
      "South West Zone": "#CD7F32",
      "Division Level": "#4CAF50",
      "City Level": "#2196F3",
    };
    return colors[level] || "#1976d2";
  };

  return (
    <Card
      sx={{
        height: "100%",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 6,
        },
        position: "relative",
        overflow: "visible",
      }}
      onClick={() => setExpanded(!expanded)}>
      <Box
        sx={{
          position: "absolute",
          top: -20,
          left: 20,
          backgroundColor: getLevelColor(level),
          color: "white",
          padding: "5px 15px",
          borderRadius: "15px",
          boxShadow: 2,
        }}>
        <Typography variant="subtitle2">{level}</Typography>
      </Box>
      <CardContent sx={{ pt: 4 }}>
        {!expanded ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <EmojiEvents sx={{ mr: 1, color: getLevelColor(level) }} />
              <Typography variant="h6">
                {achievements.length} Achievement
                {achievements.length !== 1 ? "s" : ""}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {achievements.map((achievement, idx) => (
                <Chip
                  key={idx}
                  icon={achievement.type === "team" ? <Groups /> : <Person />}
                  label={achievement.sport}
                  size="small"
                />
              ))}
            </Box>
          </>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Sport</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Year</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {achievements.map((achievement, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{achievement.sport}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {achievement.type === "team" ? (
                            <Groups sx={{ mr: 1 }} />
                          ) : (
                            <Person sx={{ mr: 1 }} />
                          )}
                          {achievement.type}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {achievement.type === "individual"
                          ? achievement.studentName
                          : "Team"}
                      </TableCell>
                      <TableCell>{achievement.position}</TableCell>
                      <TableCell>{achievement.year}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const StatsBar = ({ achievements }) => {
  const [stats, setStats] = useState([]);

  const calculateStats = () => {
    // Group achievements by level and count selections
    const levelStats = achievements.reduce((acc, category) => {
      const individualCount = category.achievements.filter(
        (a) => a.type === "individual"
      ).length;
      const teamCount = category.achievements.filter(
        (a) => a.type === "team"
      ).length;
      // Assuming each team has approximately 15 players
      const totalSelections = individualCount + teamCount * 15;

      acc[category.level] = {
        count: totalSelections,
        label: `${category.level} Selections`,
      };
      return acc;
    }, {});

    return Object.entries(levelStats).map(([level, data]) => ({
      level,
      ...data,
    }));
  };

  useEffect(() => {
    setStats(calculateStats());
  }, [achievements]); // Recalculate when achievements change

  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        bottom: 0, // Adjust this value to position above footer
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        py: 2,
        zIndex: 2,
      }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          justifyContent="space-around"
          alignItems="center">
          {stats.map((stat, index) => (
            <Box
              key={index}
              sx={{
                textAlign: "center",
                color: "white",
                px: 2,
              }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: getLevelColor(stat.level),
                }}>
                <CountUp
                  start={0}
                  end={stat.count}
                  duration={1.5}
                  delay={0.1}
                  separator=","
                  useEasing={true}>
                  {({ countUpRef }) => <span ref={countUpRef} />}
                </CountUp>
                +
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Container>
    </Paper>
  );
};

const Achievements = () => {
  const [achievementsData, setAchievementsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/achievements`
        );

        if (data && data.length > 0) {
          // Format data from API to match component structure
          const formattedData = formatAchievementsData(data);
          setAchievementsData(formattedData);
          setFilteredData(formattedData);
        } else {
          // Fallback to static data if API returns empty
          setAchievementsData(staticAchievements);
          setFilteredData(staticAchievements);
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
        setAchievementsData(staticAchievements);
        setFilteredData(staticAchievements);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // Filter achievements by year
  useEffect(() => {
    if (achievementsData.length === 0) return;

    const filteredByYear = achievementsData
      .map((category) => {
        const filteredAchievements = category.achievements.filter(
          (achievement) => achievement.year === selectedYear.toString()
        );

        return {
          ...category,
          achievements: filteredAchievements,
        };
      })
      .filter((category) => category.achievements.length > 0);

    setFilteredData(filteredByYear);
  }, [selectedYear, achievementsData]);

  // Format data from API to match the component structure
  const formatAchievementsData = (achievements) => {
    // Group achievements by level
    const groupedByLevel = achievements.reduce((acc, achievement) => {
      const level = achievement.level;
      if (!acc[level]) {
        acc[level] = [];
      }

      // Map API fields to component fields
      acc[level].push({
        sport: achievement.sportType,
        type:
          achievement.classification === "Individual" ? "individual" : "team",
        studentName: achievement.participantName,
        position: achievement.position,
        year: achievement.year,
      });

      return acc;
    }, {});

    // Convert to array format needed by component
    return Object.entries(groupedByLevel).map(([level, achievements]) => ({
      level,
      achievements,
    }));
  };

  // Function to update achievements (for admin actions)
  const updateAchievements = (newAchievements) => {
    setAchievementsData(newAchievements);
  };

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "grey.500",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('/images/achievements-bg.jpg')`,
        minHeight: "100vh",
        width: "100%",
        py: 8,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,.2)",
        },
      }}>
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          sx={{ mb: 4, color: "white" }}>
          Our Achievements
        </Typography>

        {/* Year Filter Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <ButtonGroup
            variant="contained"
            color="primary"
            size="large"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              "& .MuiButton-root": {
                px: 3,
                fontWeight: "bold",
                "&.selected": {
                  backgroundColor: "#f50057",
                },
              },
            }}>
            {/* Generate buttons for current year and 2 previous years */}
            {[...Array(3)].map((_, idx) => {
              const year = new Date().getFullYear() - (2 - idx);
              return (
                <Button
                  key={year}
                  className={selectedYear === year ? "selected" : ""}
                  onClick={() => setSelectedYear(year)}>
                  {year}
                </Button>
              );
            })}
          </ButtonGroup>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
            <CircularProgress sx={{ color: "white" }} />
          </Box>
        ) : filteredData.length === 0 ? (
          <Box sx={{ textAlign: "center", my: 5 }}>
            <Typography variant="h5" sx={{ color: "white" }}>
              No achievements found for {selectedYear}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredData.map((category) => (
              <Grid item xs={12} md={6} key={category.level}>
                <AchievementCard
                  level={category.level}
                  achievements={category.achievements}
                  onUpdate={(updatedAchievements) => {
                    const newData = achievementsData.map((cat) =>
                      cat.level === category.level
                        ? { ...cat, achievements: updatedAchievements }
                        : cat
                    );
                    updateAchievements(newData);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Stats Bar */}
        {!loading && <StatsBar achievements={filteredData} />}
      </Container>
    </Box>
  );
};

// Helper function for colors
const getLevelColor = (level) => {
  const colors = {
    "Khelo India": "#00a693",
    "All India Inter University": "#FF0000",
    "South West Zone": "#CD7F32",
    "Division Level": "#4CAF50",
    "City Level": "#2196F3",
  };
  return colors[level] || "#1976d2";
};

export default Achievements;
