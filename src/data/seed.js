// Sample/placeholder content. Real titles/URLs should be entered by the
// administrator in /admin — nothing here is a real Lowrance destination.

export const seedCategories = [
  { id: 'schedules', name: 'Schedules', description: 'Bell schedules, delays, and lunch times.', icon: 'calendar', order: 1, active: true },
  { id: 'communication', name: 'Communication', description: 'News, updates, and family messaging.', icon: 'chat', order: 2, active: true },
  { id: 'contacts', name: 'Contacts', description: 'Staff directory, departments, and support.', icon: 'people', order: 3, active: true },
  { id: 'forms', name: 'Forms & Resources', description: 'Important forms, policies, and helpful links.', icon: 'document', order: 4, active: true },
  { id: 'technology', name: 'Technology', description: 'Logins, help, and digital tools.', icon: 'laptop', order: 5, active: true },
  { id: 'academics', name: 'Academics', description: 'Curriculum, programs, and student support.', icon: 'books', order: 6, active: true },
  { id: 'student-life', name: 'Student Life', description: 'Clubs, activities, athletics, and more.', icon: 'heart', order: 7, active: true },
  { id: 'quick-links', name: 'Quick Links', description: 'Frequently used favorites.', icon: 'star', order: 8, active: true },
];

export const seedResources = [
  { id: 'r1', title: 'Regular Bell Schedule', url: '#', categoryId: 'schedules', description: 'Standard daily class times.', keywords: ['bell', 'schedule', 'times'], featured: true, active: true, order: 1 },
  { id: 'r2', title: 'Two-Hour Delay Schedule', url: '#', categoryId: 'schedules', description: 'Adjusted schedule for late starts.', keywords: ['delay', 'weather'], featured: true, active: true, order: 2 },
  { id: 'r3', title: 'Lunch Schedule', url: '#', categoryId: 'schedules', description: 'Lunch periods by grade.', keywords: ['lunch', 'cafeteria'], active: true, order: 3 },
  { id: 'r4', title: 'Testing Schedule', url: '#', categoryId: 'schedules', description: 'Dates and times for standardized testing.', keywords: ['testing', 'exam'], active: true, order: 4 },
  { id: 'r5', title: 'Early Release Schedule', url: '#', categoryId: 'schedules', description: 'Shortened-day schedule.', keywords: ['early release'], active: true, order: 5 },

  { id: 'r6', title: 'School Website', url: '#', categoryId: 'communication', description: 'The main Lowrance Middle School website.', keywords: ['website'], active: true, order: 1 },
  { id: 'r7', title: 'Staff Announcements', url: '#', categoryId: 'communication', description: 'Weekly staff bulletin.', keywords: ['announcements', 'bulletin'], active: true, order: 2 },
  { id: 'r8', title: 'Family Communication', url: '#', categoryId: 'communication', description: 'How the school reaches families.', keywords: ['newsletter', 'family'], active: true, order: 3 },

  { id: 'r9', title: 'Main Office', url: '#', categoryId: 'contacts', description: 'Front office phone and email.', keywords: ['office'], featured: true, active: true, order: 1 },
  { id: 'r10', title: 'Staff Directory', url: '#', categoryId: 'contacts', description: 'Find any staff member.', keywords: ['directory', 'staff'], featured: true, active: true, order: 2 },
  { id: 'r11', title: 'Administration', url: '#', categoryId: 'contacts', description: 'Principal and assistant principals.', keywords: ['admin', 'principal'], active: true, order: 3 },

  { id: 'r12', title: 'Technology Help', url: '#', categoryId: 'technology', description: 'Get help with a device issue.', keywords: ['help desk', 'IT'], featured: true, active: true, order: 1 },
  { id: 'r13', title: 'Chromebook Information', url: '#', categoryId: 'technology', description: 'Chromebook care and troubleshooting.', keywords: ['chromebook'], active: true, order: 2 },
  { id: 'r14', title: 'Staff Technology Resources', url: '#', categoryId: 'technology', description: 'Tools and logins for staff.', keywords: ['staff tech'], active: true, order: 3 },

  { id: 'r15', title: 'Field Trip Request Form', url: '#', categoryId: 'forms', description: 'Submit a field trip request.', keywords: ['field trip', 'form'], active: true, order: 1 },
  { id: 'r16', title: 'Building Use Policy', url: '#', categoryId: 'forms', description: 'Guidelines for after-hours building use.', keywords: ['policy'], active: true, order: 2 },
];
