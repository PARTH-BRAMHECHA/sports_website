import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

const RecentAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        console.log('Fetching achievements for RecentAchievements component...');
        const { data } = await axios.get('http://localhost:4000/api/achievements');
        console.log('RecentAchievements data received:', data);
        
        const currentYear = new Date().getFullYear();
        const recentAchievements = data.filter(achievement => 
          achievement.year === currentYear || achievement.year === currentYear.toString()
        );
        console.log('Filtered recent achievements:', recentAchievements);
        setAchievements(recentAchievements);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Recent Achievements
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      ) : achievements.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Level</TableCell>
                <TableCell>Sport</TableCell>
                <TableCell>Classification</TableCell>
                <TableCell>Participant Name</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {achievements.map((achievement) => (
                <TableRow key={achievement._id}>
                  <TableCell>{achievement.level}</TableCell>
                  <TableCell>{achievement.sportType}</TableCell>
                  <TableCell>{achievement.classification}</TableCell>
                  <TableCell>{achievement.participantName}</TableCell>
                  <TableCell>{achievement.position}</TableCell>
                  <TableCell>{achievement.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography align="center" color="textSecondary">
          No recent achievements found
        </Typography>
      )}
    </Box>
  );
};

export default RecentAchievements;