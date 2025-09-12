# Dynamic Analytics API Examples

This document provides examples of how to use the new dynamic analytics endpoints that calculate real-time percentages and "this week" values for the dashboard cards.

## Overview

The new endpoints provide dynamic calculations for:
- **Percentage changes**: Week-over-week percentage changes for each metric
- **This week values**: Actual values for the current week with proper formatting
- **Trend indicators**: Whether the metric is trending up or down

## API Endpoints

### 1. Comprehensive Dashboard Analytics
**GET** `/api/user-analytics/dashboard`

Returns all dashboard metrics with dynamic percentages and this week values in a single call.

**Response Example:**
```json
{
  "success": true,
  "message": "Dashboard analytics with dynamic percentages and this week values",
  "data": {
    "newSubscribers": {
      "thisWeek": 15,
      "percentage": 25.5,
      "thisWeekFormatted": "+15 this week",
      "trend": "up"
    },
    "delinquentSubscribers": {
      "thisWeek": 3,
      "percentage": -12.5,
      "thisWeekFormatted": "+3 this week",
      "trend": "down"
    },
    "avgQuizCompletionTime": {
      "thisWeek": 1250.5,
      "percentage": 8.2,
      "thisWeekFormatted": "+20m 50s this week",
      "trend": "up",
      "formatted": "20m 50s"
    },
    "revenue": {
      "thisWeek": 250000,
      "percentage": 15.8,
      "thisWeekFormatted": "+$2,500.00 this week",
      "trend": "up",
      "formatted": "$2,500.00"
    }
  }
}
```

### 2. Individual Metric Analytics

#### New Subscribers Analytics
**GET** `/api/user-analytics/new-subscribers-analytics`

**Response Example:**
```json
{
  "success": true,
  "data": {
    "thisWeek": 15,
    "percentage": 25.5,
    "thisWeekFormatted": "+15 this week",
    "trend": "up"
  }
}
```

#### Delinquent Subscribers Analytics
**GET** `/api/user-analytics/delinquent-subscribers-analytics`

**Response Example:**
```json
{
  "success": true,
  "data": {
    "thisWeek": 3,
    "percentage": -12.5,
    "thisWeekFormatted": "+3 this week",
    "trend": "down"
  }
}
```

#### Average Quiz Completion Time Analytics
**GET** `/api/user-analytics/avg-completion-time-analytics`

**Response Example:**
```json
{
  "success": true,
  "data": {
    "thisWeek": 1250.5,
    "percentage": 8.2,
    "thisWeekFormatted": "+20m 50s this week",
    "trend": "up",
    "formatted": "20m 50s"
  }
}
```

#### Revenue Analytics
**GET** `/api/user-analytics/revenue-analytics`

**Response Example:**
```json
{
  "success": true,
  "data": {
    "thisWeek": 250000,
    "percentage": 15.8,
    "thisWeekFormatted": "+$2,500.00 this week",
    "trend": "up",
    "formatted": "$2,500.00"
  }
}
```

## Frontend Usage Examples

### Using Redux (Recommended)

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchDashboardAnalytics, 
  selectDashboardAnalytics,
  selectAdminDashboardLoading 
} from '../store/Slice/DashboardSliceAdmin';

const DashboardComponent = () => {
  const dispatch = useDispatch();
  const analytics = useSelector(selectDashboardAnalytics);
  const loading = useSelector(selectAdminDashboardLoading);

  useEffect(() => {
    dispatch(fetchDashboardAnalytics());
  }, [dispatch]);

  if (loading.dashboardAnalytics) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div>
      <div>New Subscribers: {analytics.newSubscribers?.thisWeekFormatted}</div>
      <div>Percentage: {analytics.newSubscribers?.percentage}%</div>
      <div>Trend: {analytics.newSubscribers?.trend}</div>
    </div>
  );
};
```

### Using Fetch API

```javascript
const fetchDashboardAnalytics = async () => {
  try {
    const response = await fetch('/api/user-analytics/dashboard');
    const data = await response.json();
    
    if (data.success) {
      const { newSubscribers, delinquentSubscribers, avgQuizCompletionTime, revenue } = data.data;
      
      // Use the dynamic data
      console.log('New subscribers this week:', newSubscribers.thisWeekFormatted);
      console.log('Percentage change:', newSubscribers.percentage);
      console.log('Trend:', newSubscribers.trend);
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
  }
};
```

### Using Axios

```javascript
import axios from 'axios';

const fetchAnalytics = async () => {
  try {
    const response = await axios.get('/api/user-analytics/dashboard');
    const { data } = response.data;
    
    // Format percentage with trend arrow
    const formatPercentage = (analytics) => {
      const arrow = analytics.trend === 'up' ? '↑' : '↓';
      return `${arrow} ${Math.abs(analytics.percentage).toFixed(1)}%`;
    };
    
    return {
      newSubscribers: {
        value: data.newSubscribers.thisWeek,
        percentage: formatPercentage(data.newSubscribers),
        thisWeek: data.newSubscribers.thisWeekFormatted
      },
      // ... other metrics
    };
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Data Structure

### Analytics Object Structure
Each analytics object contains:

- **thisWeek**: Raw numeric value for the current week
- **percentage**: Calculated percentage change from last week
- **thisWeekFormatted**: Formatted string for display (e.g., "+15 this week")
- **trend**: "up" or "down" indicating the direction of change
- **formatted**: Additional formatted value (for time and revenue metrics)

### Calculation Logic

1. **Week Definition**: Weeks start on Sunday (0) and end on Saturday (6)
2. **Percentage Calculation**: `((thisWeek - lastWeek) / lastWeek) * 100`
3. **Trend Determination**: Positive percentage = "up", negative = "down"
4. **Fallback Values**: If no data exists, defaults to 0% with "up" trend

## Error Handling

The endpoints include comprehensive error handling:

- **Stripe API failures**: Falls back to database calculations
- **Missing data**: Returns 0 values with appropriate defaults
- **Invalid dates**: Uses current date as fallback
- **Database errors**: Returns 500 status with error message

## Performance Considerations

- **Caching**: Consider implementing Redis caching for frequently accessed analytics
- **Batch Loading**: Use the comprehensive `/dashboard` endpoint to reduce API calls
- **Real-time Updates**: Consider WebSocket connections for live updates
- **Pagination**: For large datasets, implement pagination in future versions

## Migration Guide

### From Static to Dynamic Values

**Before (Static):**
```javascript
const card = {
  stat: "↑ 20.9%",
  week: "+18.4K this week"
};
```

**After (Dynamic):**
```javascript
const card = {
  stat: formatPercentage(analytics.percentage, analytics.trend),
  week: analytics.thisWeekFormatted
};
```

### Backward Compatibility

The new endpoints are additive and don't break existing functionality. You can:
1. Gradually migrate cards to use dynamic data
2. Keep existing endpoints for backward compatibility
3. Use fallback values when dynamic data is unavailable
