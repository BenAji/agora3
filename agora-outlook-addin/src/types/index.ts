export const UserRole = {
  IR_ADMIN: 'IR_ADMIN',
  ANALYST_MANAGER: 'ANALYST_MANAGER',
  INVESTMENT_ANALYST: 'INVESTMENT_ANALYST'
} as const;

export const CompanyType = {
  IR: 'IR',
  ANALYST: 'ANALYST'
} as const;

export const RSVPStatus = {
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  TENTATIVE: 'TENTATIVE'
} as const;

export const EventType = {
  EARNINGS_CALL: 'EARNINGS_CALL',
  INVESTOR_MEETING: 'INVESTOR_MEETING',
  CONFERENCE: 'CONFERENCE',
  ROADSHOW: 'ROADSHOW',
  WEBINAR: 'WEBINAR'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];
export type CompanyType = typeof CompanyType[keyof typeof CompanyType];
export type RSVPStatus = typeof RSVPStatus[keyof typeof RSVPStatus];
export type EventType = typeof EventType[keyof typeof EventType];

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  industry?: string;
  country?: string;
  marketCap?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  eventType: EventType;
  companyId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RSVP {
  id: string;
  eventId: string;
  userId: string;
  status: RSVPStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalystAssignment {
  id: string;
  eventId: string;
  analystId: string;
  assignedById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FollowedCompany {
  id: string;
  userId: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extended types for UI components
export interface EventWithDetails extends Event {
  company: Company;
  createdBy: User;
  rsvps: RSVP[];
  assignments: AnalystAssignment[];
}

export interface UserWithCompany extends User {
  company: Company;
}

export interface RSVPWithDetails extends RSVP {
  event: EventWithDetails;
  user: UserWithCompany;
}

// Authentication types
export interface AuthState {
  user: UserWithCompany | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Calendar types
export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  company: Company;
  eventType: EventType;
  rsvpStatus?: RSVPStatus;
  isAssigned?: boolean;
}

export interface CalendarFilters {
  companies: string[];
  eventTypes: EventType[];
  dateRange: {
    start: Date;
    end: Date;
  };
  countries: string[];
  industries: string[];
  marketCapRange: {
    min: number;
    max: number;
  };
}

// Analytics types
export interface AnalyticsData {
  totalEvents: number;
  totalRSVPs: number;
  acceptedRSVPs: number;
  declinedRSVPs: number;
  tentativeRSVPs: number;
  engagementRate: number;
  totalMeetings?: number;
  eventConflicts?: number;
  followedCompanies?: number;
  followedCompaniesCap?: number;
}

// CSV Import types
export interface CSVEventData {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  eventType: string;
}

export interface CSVImportResult {
  success: boolean;
  importedCount: number;
  errors: string[];
  events?: Event[];
}