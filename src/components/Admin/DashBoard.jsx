import React from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  Film, 
  Ticket, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  Star
} from 'lucide-react';

const StatBox = ({ title, value, icon: Icon, color = 'primary' }) => (
  <Paper sx={{ 
    p: 3, 
    textAlign: 'center', 
    bgcolor: '#fff', 
    boxShadow: 3,
    borderRadius: 2,
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 6
    }
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
      <Icon size={24} color={color === 'primary' ? '#1976d2' : color === 'success' ? '#2e7d32' : '#ed6c02'} />
    </Box>
    <Typography variant="h6" sx={{ mb: 1, fontSize: '0.95rem', fontWeight: 500 }}>
      {title}
    </Typography>
    <Typography variant="h4" color={color} sx={{ fontWeight: 'bold' }}>
      {value}
    </Typography>
  </Paper>
);

const Dashboard = () => {
  // Sample data for weekly revenue chart
  // const weeklyRevenueData = [
  //   { day: 'T2', revenue: 12000000 },
  //   { day: 'T3', revenue: 8500000 },
  //   { day: 'T4', revenue: 15200000 },
  //   { day: 'T5', revenue: 18900000 },
  //   { day: 'T6', revenue: 25600000 },
  //   { day: 'T7', revenue: 32400000 },
  //   { day: 'CN', revenue: 35800000 }
  // ];

  // Sample data for movies ending soon
  const moviesEndingSoon = [
    { title: 'Avatar: The Way of Water', endDate: '2025-06-30', showsLeft: 3 },
    { title: 'Top Gun: Maverick', endDate: '2025-07-02', showsLeft: 5 },
    { title: 'Black Panther: Wakanda Forever', endDate: '2025-07-05', showsLeft: 2 },
    { title: 'The Batman', endDate: '2025-07-08', showsLeft: 4 }
  ];

  // Sample data for top selling movies
  const topSellingMovies = [
    { title: 'Spider-Man: No Way Home', tickets: 2850, revenue: '142M VNĐ' },
    { title: 'Avengers: Endgame', tickets: 2640, revenue: '132M VNĐ' },
    { title: 'Fast X', tickets: 2280, revenue: '114M VNĐ' },
    { title: 'John Wick 4', tickets: 1950, revenue: '97M VNĐ' },
    { title: 'Guardians of the Galaxy 3', tickets: 1720, revenue: '86M VNĐ' }
  ];

  const formatCurrency = (value) => {
    return `${(value / 1000000).toFixed(1)}M`;
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#333' }}>
        Dashboard Quản Lý Rạp Chiếu Phim
      </Typography>
      
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatBox 
            title="Vé bán được hôm nay" 
            value="148" 
            icon={Ticket}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatBox 
            title="Tổng doanh thu tháng" 
            value="485M VNĐ" 
            icon={DollarSign}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatBox 
            title="Phim đang chiếu" 
            value="24" 
            icon={Film}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatBox 
            title="Tăng trưởng tuần" 
            value="+12.5%" 
            icon={TrendingUp}
            color="success"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Weekly Revenue Chart */}
        {/* <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp size={20} />
                Biểu đồ doanh thu tuần (VNĐ)
              </Typography>
              <Box sx={{ width: '100%', height: 300, mt: 2 }}>
                <ResponsiveContainer>
                  <BarChart data={weeklyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis tickFormatter={formatCurrency} />
                    <Tooltip 
                      formatter={(value) => [`${formatCurrency(value)} VNĐ`, 'Doanh thu']}
                    />
                    <Bar dataKey="revenue" fill="#1976d2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid> */}

        {/* Movies Ending Soon */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AlertTriangle size={20} color="#ed6c02" />
                Phim sắp hết suất chiếu
              </Typography>
              <List dense>
                {moviesEndingSoon.map((movie, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                            {movie.title}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              Kết thúc: {movie.endDate}
                            </Typography>
                            <Chip 
                              label={`${movie.showsLeft} suất`} 
                              size="small" 
                              color={movie.showsLeft <= 2 ? 'error' : 'warning'}
                              sx={{ fontSize: '0.7rem' }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < moviesEndingSoon.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top 5 Best Selling Movies */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Star size={20} color="#ffc107" />
                Top 5 phim bán chạy nhất
              </Typography>
              <Grid container spacing={2}>
                {topSellingMovies.map((movie, index) => (
                  <Grid item xs={12} sm={6} md={2.4} key={index}>
                    <Paper sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      bgcolor: index === 0 ? '#fff3e0' : '#fff',
                      border: index === 0 ? '2px solid #ffc107' : '1px solid #e0e0e0',
                      borderRadius: 2,
                      position: 'relative'
                    }}>
                      {index === 0 && (
                        <Chip 
                          label="🏆 #1" 
                          color="warning" 
                          size="small" 
                          sx={{ 
                            position: 'absolute', 
                            top: -8, 
                            left: '50%', 
                            transform: 'translateX(-50%)',
                            fontWeight: 'bold'
                          }} 
                        />
                      )}
                      <Typography variant="h6" sx={{ 
                        color: index === 0 ? '#f57c00' : '#333',
                        fontSize: index === 0 ? '1.5rem' : '1.2rem',
                        fontWeight: 'bold',
                        mb: 1,
                        mt: index === 0 ? 1 : 0
                      }}>
                        #{index + 1}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 500, 
                        mb: 1,
                        minHeight: '2.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {movie.title}
                      </Typography>
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                        {movie.tickets.toLocaleString()} vé
                      </Typography>
                      <Typography variant="caption" color="success.main" sx={{ fontWeight: 500 }}>
                        {movie.revenue}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;