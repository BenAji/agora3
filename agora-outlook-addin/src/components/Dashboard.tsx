import React, { useState, useEffect } from 'react';
import { useRole } from '../contexts/AuthContext';
import { database } from '../services/database';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Building, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  trend?: string;
  trendUp?: boolean;
  description?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp, 
  description 
}) => (
  <div className="card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="h-12 w-12 bg-primary-500/10 rounded-lg flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary-500" />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center">
        <TrendingUp className={`h-4 w-4 mr-1 ${trendUp ? 'text-green-500' : 'text-red-500'}`} />
        <span className={`text-sm font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </span>
        <span className="text-sm text-muted-foreground ml-1">vs last month</span>
      </div>
    )}
  </div>
);

const Dashboard: React.FC = () => {
  const { user, isIRAdmin, isAnalystManager, isInvestmentAnalyst } = useRole();
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get analytics for the current user
      const analyticsData = database.getAnalyticsForUser(user?.id || '');
      setAnalytics(analyticsData);

      // Get recent events based on user role
      let events = [];
      if (isIRAdmin) {
        events = database.getEventsByCompany(user?.companyId || '');
      } else {
        events = database.getEventsForUser(user?.id || '');
      }
      
      // Sort by date and take first 5
      const sortedEvents = events
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
        .slice(0, 5);
      
      setRecentEvents(sortedEvents);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWelcomeMessage = () => {
    if (isIRAdmin) return "Welcome back to your IR Admin dashboard";
    if (isAnalystManager) return "Welcome back to your Analyst Manager dashboard";
    if (isInvestmentAnalyst) return "Welcome back to your Investment Analyst dashboard";
    return "Welcome back";
  };

  const getRSVPStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'DECLINED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'TENTATIVE':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">Hello, {user?.name}!</h1>
        <p className="text-muted-foreground">{getWelcomeMessage()}</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isIRAdmin && analytics && (
          <>
            <DashboardCard
              title="Total Events"
              value={analytics.totalEvents}
              icon={Calendar}
              trend="+12%"
              trendUp={true}
            />
            <DashboardCard
              title="Total RSVPs"
              value={analytics.totalRSVPs}
              icon={Users}
              trend="+8%"
              trendUp={true}
            />
            <DashboardCard
              title="Accepted RSVPs"
              value={analytics.acceptedRSVPs}
              icon={CheckCircle}
              description={`${analytics.engagementRate.toFixed(1)}% engagement rate`}
            />
            <DashboardCard
              title="Engagement Rate"
              value={`${analytics.engagementRate.toFixed(1)}%`}
              icon={TrendingUp}
              trend="+2.5%"
              trendUp={true}
            />
          </>
        )}

        {(isAnalystManager || isInvestmentAnalyst) && analytics && (
          <>
            <DashboardCard
              title="Total Meetings"
              value={analytics.totalMeetings || 0}
              icon={Calendar}
              trend="+5%"
              trendUp={true}
            />
            <DashboardCard
              title="My RSVPs"
              value={analytics.totalRSVPs}
              icon={Users}
            />
            <DashboardCard
              title="Followed Companies"
              value={analytics.followedCompanies || 0}
              icon={Building}
            />
            <DashboardCard
              title="Market Cap"
              value={`$${((analytics.followedCompaniesCap || 0) / 1000000000).toFixed(1)}B`}
              icon={TrendingUp}
              description="Total market cap of followed companies"
            />
          </>
        )}
      </div>

      {/* Recent Events */}
      <div className="card">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold">
            {isIRAdmin ? 'Recent Events' : 'Upcoming Meetings'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isIRAdmin ? 'Events you have created' : 'Events assigned to you'}
          </p>
        </div>
        <div className="divide-y divide-border">
          {recentEvents.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No recent events found
            </div>
          ) : (
            recentEvents.map((event) => {
              const company = database.getCompanyById(event.companyId);
              const rsvps = database.getRSVPsForEvent(event.id);
              const userRSVP = rsvps.find(r => r.userId === user?.id);
              
              return (
                <div key={event.id} className="p-6 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{event.title}</h4>
                        <span className="text-xs px-2 py-1 bg-primary-500/10 text-primary-500 rounded">
                          {event.eventType.replace('_', ' ').toLowerCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {company?.name} • {format(event.startTime, 'MMM d, yyyy h:mm a')}
                      </p>
                      {event.location && (
                        <p className="text-xs text-muted-foreground mt-1">
                          📍 {event.location}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {!isIRAdmin && userRSVP && (
                        <div className="flex items-center space-x-1">
                          {getRSVPStatusIcon(userRSVP.status)}
                          <span className="text-xs text-muted-foreground">
                            {userRSVP.status.toLowerCase()}
                          </span>
                        </div>
                      )}
                      {isIRAdmin && (
                        <span className="text-xs text-muted-foreground">
                          {rsvps.length} RSVP{rsvps.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isIRAdmin && (
            <>
              <button className="btn btn-primary p-4 h-auto">
                <Calendar className="h-5 w-5 mb-2" />
                Create New Event
              </button>
              <button className="btn btn-outline p-4 h-auto">
                <Users className="h-5 w-5 mb-2" />
                View RSVPs
              </button>
              <button className="btn btn-outline p-4 h-auto">
                <TrendingUp className="h-5 w-5 mb-2" />
                Export Analytics
              </button>
            </>
          )}
          {(isAnalystManager || isInvestmentAnalyst) && (
            <>
              <button className="btn btn-primary p-4 h-auto">
                <Calendar className="h-5 w-5 mb-2" />
                View Calendar
              </button>
              <button className="btn btn-outline p-4 h-auto">
                <Building className="h-5 w-5 mb-2" />
                Follow Companies
              </button>
              <button className="btn btn-outline p-4 h-auto">
                <TrendingUp className="h-5 w-5 mb-2" />
                View Analytics
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;