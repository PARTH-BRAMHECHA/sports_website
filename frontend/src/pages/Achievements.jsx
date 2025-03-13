import React, { useState, useEffect } from 'react';
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
  Paper
} from '@mui/material';
import { EmojiEvents, Groups, Person } from '@mui/icons-material';
import CountUp from 'react-countup';

// Static achievements data
const staticAchievements = [
  {
    level: "Khelo India",
    achievements: [
      {
        sport: "Wrestling",
        type: "individual",
        studentName: "Rahul Kumar",
        position: "Gold Medal",
        year: 2024
      },
      {
        sport: "Athletics",
        type: "individual",
        studentName: "Priya Sharma",
        position: "Silver Medal - 100m Sprint",
        year: 2024
      }
    ]
  },
  {
    level: "All India Inter University",
    achievements: [
      {
        sport: "Cricket",
        type: "team",
        position: "Winners",
        year: 2024
      },
      {
        sport: "Basketball",
        type: "team",
        position: "Runners Up",
        year: 2024
      }
    ]
  },
  {
    level: "South West Zone",
    achievements: [
      {
        sport: "Football",
        type: "team",
        position: "Champions",
        year: 2024
      },
      {
        sport: "Table Tennis",
        type: "individual",
        studentName: "Amit Patel",
        position: "Winner",
        year: 2024
      }
    ]
  },
  {
    level: "Division Level",
    achievements: [
      {
        sport: "Badminton",
        type: "individual",
        studentName: "Sneha Reddy",
        position: "Gold Medal",
        year: 2023
      }
    ]
  },
  {
    level: "City Level",
    achievements: [
      {
        sport: "Chess",
        type: "individual",
        studentName: "Rohan Shah",
        position: "Champion",
        year: 2023
      }
    ]
  }
];

const AchievementCard = ({ level, achievements, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);

  const getLevelColor = (level) => {
    const colors = {
      "Khelo India": "#00a693",
      "All India Inter University": "#FF0000",
      "South West Zone": "#CD7F32",
      "Division Level": "#4CAF50",
      "City Level": "#2196F3"
    };
    return colors[level] || "#1976d2";
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': { 
          transform: 'scale(1.02)',
          boxShadow: 6
        },
        position: 'relative',
        overflow: 'visible'
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          left: 20,
          backgroundColor: getLevelColor(level),
          color: 'white',
          padding: '5px 15px',
          borderRadius: '15px',
          boxShadow: 2
        }}
      >
        <Typography variant="subtitle2">
          {level}
        </Typography>
      </Box>
      <CardContent sx={{ pt: 4 }}>
        {!expanded ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmojiEvents sx={{ mr: 1, color: getLevelColor(level) }} />
              <Typography variant="h6">
                {achievements.length} Achievement{achievements.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {achievements.map((achievement, idx) => (
                <Chip
                  key={idx}
                  icon={achievement.type === 'team' ? <Groups /> : <Person />}
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
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {achievement.type === 'team' ? <Groups sx={{ mr: 1 }} /> : <Person sx={{ mr: 1 }} />}
                          {achievement.type}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {achievement.type === 'individual' ? achievement.studentName : 'Team'}
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
      const individualCount = category.achievements.filter(a => a.type === 'individual').length;
      const teamCount = category.achievements.filter(a => a.type === 'team').length;
      // Assuming each team has approximately 15 players
      const totalSelections = individualCount + (teamCount * 15);
      
      acc[category.level] = {
        count: totalSelections,
        label: `${category.level} Selections`
      };
      return acc;
    }, {});

    return Object.entries(levelStats).map(([level, data]) => ({
      level,
      ...data
    }));
  };

  useEffect(() => {
    setStats(calculateStats());
  }, [achievements]); // Recalculate when achievements change

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 0, // Adjust this value to position above footer
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        py: 2,
        zIndex: 2
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          justifyContent="space-around"
          alignItems="center"
        >
          {stats.map((stat, index) => (
            <Box
              key={index}
              sx={{
                textAlign: 'center',
                color: 'white',
                px: 2
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: getLevelColor(stat.level)
                }}
              >
                <CountUp
                  start={0}
                  end={stat.count}
                  duration={1.5}
                  delay={0.1}
                  separator=","
                  useEasing={true}
                >
                  {({ countUpRef }) => (
                    <span ref={countUpRef} />
                  )}
                </CountUp>
                +
              </Typography>
              <Typography 
                variant="body2"
                sx={{ 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
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
  const [achievementsData, setAchievementsData] = useState(staticAchievements);

  // Function to update achievements (for admin actions)
  const updateAchievements = (newAchievements) => {
    setAchievementsData(newAchievements);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: 'grey.500',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('images/achievements-bg.jpg')`,
        minHeight: '100vh',
        width: '100%',
        py: 8,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,.2)',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ mb: 6, color: 'white' }}>
          Our Achievements
        </Typography>

        <Grid container spacing={4}>
          {achievementsData.map((category) => (
            <Grid item xs={12} md={6} key={category.level}>
              <AchievementCard 
                level={category.level} 
                achievements={category.achievements}
                onUpdate={(updatedAchievements) => {
                  const newData = achievementsData.map(cat => 
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
        
        {/* Stats Bar */}
        <StatsBar achievements={achievementsData} />
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
    "City Level": "#2196F3"
  };
  return colors[level] || "#1976d2";
};

export default Achievements; 