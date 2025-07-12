import type {
  User, Company, Event, RSVP, AnalystAssignment, FollowedCompany,
  UserWithCompany, EventWithDetails
} from '../types';
import {
  UserRole, CompanyType, RSVPStatus, EventType
} from '../types';

// In-memory database
class Database {
  private users: Map<string, User> = new Map();
  private companies: Map<string, Company> = new Map();
  private events: Map<string, Event> = new Map();
  private rsvps: Map<string, RSVP> = new Map();
  private assignments: Map<string, AnalystAssignment> = new Map();
  private followedCompanies: Map<string, FollowedCompany> = new Map();
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private initialize() {
    if (this.initialized) return;

    // Seed Companies
    const companies = [
      { id: 'apple', name: 'Apple Inc.', type: CompanyType.IR, industry: 'Technology', country: 'USA', marketCap: 3000000000000 },
      { id: 'microsoft', name: 'Microsoft Corporation', type: CompanyType.IR, industry: 'Technology', country: 'USA', marketCap: 2800000000000 },
      { id: 'tesla', name: 'Tesla Inc.', type: CompanyType.IR, industry: 'Automotive', country: 'USA', marketCap: 800000000000 },
      { id: 'bloomberg', name: 'Bloomberg LP', type: CompanyType.ANALYST, industry: 'Financial Services', country: 'USA', marketCap: 60000000000 },
      { id: 'goldman', name: 'Goldman Sachs', type: CompanyType.ANALYST, industry: 'Investment Banking', country: 'USA', marketCap: 120000000000 }
    ];

    companies.forEach(company => {
      this.companies.set(company.id, {
        ...company,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Seed Users
    const users = [
      { id: 'ir-apple', email: 'ir.admin@apple.com', name: 'Sarah Johnson', role: UserRole.IR_ADMIN, companyId: 'apple' },
      { id: 'ir-microsoft', email: 'ir.admin@microsoft.com', name: 'Michael Chen', role: UserRole.IR_ADMIN, companyId: 'microsoft' },
      { id: 'ir-tesla', email: 'ir.admin@tesla.com', name: 'Emma Rodriguez', role: UserRole.IR_ADMIN, companyId: 'tesla' },
      { id: 'spencer', email: 'spencer.beasley@bloomberg.com', name: 'Spencer Beasley', role: UserRole.ANALYST_MANAGER, companyId: 'bloomberg' },
      { id: 'deborah', email: 'deborah.drake@bloomberg.com', name: 'Deborah Drake', role: UserRole.INVESTMENT_ANALYST, companyId: 'bloomberg' },
      { id: 'ewan', email: 'ewan.martinez@bloomberg.com', name: 'Ewan Martinez', role: UserRole.INVESTMENT_ANALYST, companyId: 'bloomberg' },
      { id: 'clyde', email: 'clyde.nelson@bloomberg.com', name: 'Clyde Nelson', role: UserRole.INVESTMENT_ANALYST, companyId: 'bloomberg' }
    ];

    users.forEach(user => {
      this.users.set(user.id, {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Seed Events
    const now = new Date();
    const events = [
      {
        id: 'event-1',
        title: 'Apple Q4 2024 Earnings Call',
        description: 'Quarterly earnings discussion for Apple Inc.',
        startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
        endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // Tomorrow + 1 hour
        location: 'Virtual/Webcast',
        eventType: EventType.EARNINGS_CALL,
        companyId: 'apple',
        createdById: 'ir-apple'
      },
      {
        id: 'event-2',
        title: 'Microsoft Investor Meeting',
        description: 'Strategic roadmap discussion with key investors',
        startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // Day after tomorrow + 2 hours
        location: 'Microsoft Campus, Redmond',
        eventType: EventType.INVESTOR_MEETING,
        companyId: 'microsoft',
        createdById: 'ir-microsoft'
      },
      {
        id: 'event-3',
        title: 'Tesla Battery Day Conference',
        description: 'Latest innovations in battery technology',
        startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        endTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 days from now + 3 hours
        location: 'Tesla Gigafactory, Nevada',
        eventType: EventType.CONFERENCE,
        companyId: 'tesla',
        createdById: 'ir-tesla'
      },
      {
        id: 'event-4',
        title: 'Apple Roadshow - NYC',
        description: 'Investor roadshow in New York City',
        startTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        endTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 1 week from now + 4 hours
        location: 'New York City',
        eventType: EventType.ROADSHOW,
        companyId: 'apple',
        createdById: 'ir-apple'
      },
      {
        id: 'event-5',
        title: 'Microsoft Cloud Strategy Webinar',
        description: 'Deep dive into Microsoft Azure and cloud services',
        startTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        endTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000), // 5 days from now + 1.5 hours
        location: 'Virtual/Webcast',
        eventType: EventType.WEBINAR,
        companyId: 'microsoft',
        createdById: 'ir-microsoft'
      }
    ];

    events.forEach(event => {
      this.events.set(event.id, {
        ...event,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Seed Analyst Assignments
    const assignments = [
      { id: 'assign-1', eventId: 'event-1', analystId: 'deborah', assignedById: 'spencer' },
      { id: 'assign-2', eventId: 'event-2', analystId: 'ewan', assignedById: 'spencer' },
      { id: 'assign-3', eventId: 'event-3', analystId: 'clyde', assignedById: 'spencer' },
      { id: 'assign-4', eventId: 'event-4', analystId: 'deborah', assignedById: 'spencer' },
      { id: 'assign-5', eventId: 'event-5', analystId: 'ewan', assignedById: 'spencer' }
    ];

    assignments.forEach(assignment => {
      this.assignments.set(assignment.id, {
        ...assignment,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Seed RSVPs
    const rsvps = [
      { id: 'rsvp-1', eventId: 'event-1', userId: 'spencer', status: RSVPStatus.ACCEPTED },
      { id: 'rsvp-2', eventId: 'event-1', userId: 'deborah', status: RSVPStatus.ACCEPTED },
      { id: 'rsvp-3', eventId: 'event-2', userId: 'spencer', status: RSVPStatus.TENTATIVE },
      { id: 'rsvp-4', eventId: 'event-2', userId: 'ewan', status: RSVPStatus.ACCEPTED },
      { id: 'rsvp-5', eventId: 'event-3', userId: 'clyde', status: RSVPStatus.DECLINED },
      { id: 'rsvp-6', eventId: 'event-4', userId: 'deborah', status: RSVPStatus.TENTATIVE },
      { id: 'rsvp-7', eventId: 'event-5', userId: 'ewan', status: RSVPStatus.ACCEPTED }
    ];

    rsvps.forEach(rsvp => {
      this.rsvps.set(rsvp.id, {
        ...rsvp,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Seed Followed Companies
    const followedCompanies = [
      { id: 'follow-1', userId: 'spencer', companyId: 'apple' },
      { id: 'follow-2', userId: 'spencer', companyId: 'microsoft' },
      { id: 'follow-3', userId: 'spencer', companyId: 'tesla' },
      { id: 'follow-4', userId: 'deborah', companyId: 'apple' },
      { id: 'follow-5', userId: 'ewan', companyId: 'microsoft' },
      { id: 'follow-6', userId: 'ewan', companyId: 'tesla' },
      { id: 'follow-7', userId: 'clyde', companyId: 'tesla' }
    ];

    followedCompanies.forEach(follow => {
      this.followedCompanies.set(follow.id, {
        ...follow,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    this.initialized = true;
  }

  // User methods
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  getUserWithCompany(id: string): UserWithCompany | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    const company = this.companies.get(user.companyId);
    if (!company) return undefined;
    return { ...user, company };
  }

  // Company methods
  getAllCompanies(): Company[] {
    return Array.from(this.companies.values());
  }

  getCompanyById(id: string): Company | undefined {
    return this.companies.get(id);
  }

  getIRCompanies(): Company[] {
    return Array.from(this.companies.values()).filter(c => c.type === CompanyType.IR);
  }

  // Event methods
  getAllEvents(): Event[] {
    return Array.from(this.events.values());
  }

  getEventById(id: string): Event | undefined {
    return this.events.get(id);
  }

  getEventWithDetails(id: string): EventWithDetails | undefined {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const company = this.companies.get(event.companyId);
    const createdBy = this.users.get(event.createdById);
    const rsvps = Array.from(this.rsvps.values()).filter(r => r.eventId === id);
    const assignments = Array.from(this.assignments.values()).filter(a => a.eventId === id);

    if (!company || !createdBy) return undefined;

    return {
      ...event,
      company,
      createdBy,
      rsvps,
      assignments
    };
  }

  getEventsByCompany(companyId: string): Event[] {
    return Array.from(this.events.values()).filter(e => e.companyId === companyId);
  }

  getEventsForUser(userId: string): Event[] {
    const user = this.users.get(userId);
    if (!user) return [];

    if (user.role === UserRole.IR_ADMIN) {
      return this.getEventsByCompany(user.companyId);
    }

    // For analysts, get assigned events
    const assignments = Array.from(this.assignments.values()).filter(a => a.analystId === userId);
    return assignments.map(a => this.events.get(a.eventId)).filter(Boolean) as Event[];
  }

  createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Event {
    const event: Event = {
      ...eventData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.events.set(event.id, event);
    return event;
  }

  updateEvent(id: string, updates: Partial<Event>): Event | undefined {
    const event = this.events.get(id);
    if (!event) return undefined;

    const updatedEvent = {
      ...event,
      ...updates,
      updatedAt: new Date()
    };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  deleteEvent(id: string): boolean {
    return this.events.delete(id);
  }

  // RSVP methods
  getRSVPsForEvent(eventId: string): RSVP[] {
    return Array.from(this.rsvps.values()).filter(r => r.eventId === eventId);
  }

  getRSVPsForUser(userId: string): RSVP[] {
    return Array.from(this.rsvps.values()).filter(r => r.userId === userId);
  }

  createOrUpdateRSVP(eventId: string, userId: string, status: RSVPStatus): RSVP {
    const existing = Array.from(this.rsvps.values()).find(r => r.eventId === eventId && r.userId === userId);
    
    if (existing) {
      const updated = {
        ...existing,
        status,
        updatedAt: new Date()
      };
      this.rsvps.set(existing.id, updated);
      return updated;
    }

    const rsvp: RSVP = {
      id: this.generateId(),
      eventId,
      userId,
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.rsvps.set(rsvp.id, rsvp);
    return rsvp;
  }

  // Assignment methods
  getAssignmentsForEvent(eventId: string): AnalystAssignment[] {
    return Array.from(this.assignments.values()).filter(a => a.eventId === eventId);
  }

  getAssignmentsForAnalyst(analystId: string): AnalystAssignment[] {
    return Array.from(this.assignments.values()).filter(a => a.analystId === analystId);
  }

  createAssignment(eventId: string, analystId: string, assignedById: string): AnalystAssignment {
    const assignment: AnalystAssignment = {
      id: this.generateId(),
      eventId,
      analystId,
      assignedById,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.assignments.set(assignment.id, assignment);
    return assignment;
  }

  deleteAssignment(id: string): boolean {
    return this.assignments.delete(id);
  }

  // Followed Companies methods
  getFollowedCompanies(userId: string): Company[] {
    const follows = Array.from(this.followedCompanies.values()).filter(f => f.userId === userId);
    return follows.map(f => this.companies.get(f.companyId)).filter(Boolean) as Company[];
  }

  followCompany(userId: string, companyId: string): FollowedCompany {
    const follow: FollowedCompany = {
      id: this.generateId(),
      userId,
      companyId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.followedCompanies.set(follow.id, follow);
    return follow;
  }

  unfollowCompany(userId: string, companyId: string): boolean {
    const follow = Array.from(this.followedCompanies.values()).find(f => f.userId === userId && f.companyId === companyId);
    if (!follow) return false;
    return this.followedCompanies.delete(follow.id);
  }

  // Analytics methods
  getAnalyticsForUser(userId: string): any {
    const user = this.users.get(userId);
    if (!user) return null;

    if (user.role === UserRole.IR_ADMIN) {
      const events = this.getEventsByCompany(user.companyId);
      const allRSVPs = events.flatMap(e => this.getRSVPsForEvent(e.id));
      
      return {
        totalEvents: events.length,
        totalRSVPs: allRSVPs.length,
        acceptedRSVPs: allRSVPs.filter(r => r.status === RSVPStatus.ACCEPTED).length,
        declinedRSVPs: allRSVPs.filter(r => r.status === RSVPStatus.DECLINED).length,
        tentativeRSVPs: allRSVPs.filter(r => r.status === RSVPStatus.TENTATIVE).length,
        engagementRate: allRSVPs.length > 0 ? (allRSVPs.filter(r => r.status === RSVPStatus.ACCEPTED).length / allRSVPs.length * 100) : 0
      };
    } else {
      const rsvps = this.getRSVPsForUser(userId);
      const assignments = this.getAssignmentsForAnalyst(userId);
      const followedCompanies = this.getFollowedCompanies(userId);
      
      return {
        totalMeetings: assignments.length,
        totalRSVPs: rsvps.length,
        acceptedRSVPs: rsvps.filter(r => r.status === RSVPStatus.ACCEPTED).length,
        declinedRSVPs: rsvps.filter(r => r.status === RSVPStatus.DECLINED).length,
        tentativeRSVPs: rsvps.filter(r => r.status === RSVPStatus.TENTATIVE).length,
        engagementRate: rsvps.length > 0 ? (rsvps.filter(r => r.status === RSVPStatus.ACCEPTED).length / rsvps.length * 100) : 0,
        followedCompanies: followedCompanies.length,
        followedCompaniesCap: followedCompanies.reduce((sum, c) => sum + (c.marketCap || 0), 0)
      };
    }
  }
}

// Export singleton instance
export const database = new Database();