// src/__tests__/mocks/gifts.mock.ts
// Comprehensive gift data mock service for testing

// Mock data for gift records
export const mockGifts = [
  {
    id: 1,
    name: "Gift for Team Celebration",
    description: "A special gift for team members",
    value: 250,
    category: "Event",
    image: "/images/gift1.jpg",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Personal Gift for Friend",
    description: "A thoughtful gift for a close friend",
    value: 150,
    category: "Personal",
    image: "/images/gift2.jpg",
    createdAt: "2025-01-16T14:20:00Z",
    updatedAt: "2025-01-16T14:20:00Z",
  },
  {
    id: 3,
    name: "Gift for Client",
    description: "A professional gift for a client",
    value: 300,
    category: "Business",
    image: "/images/gift3.jpg",
    createdAt: "2025-01-17T09:15:00Z",
    updatedAt: "2025-01-17T09:15:00Z",
  },
  {
    id: 4,
    name: "Holiday Gift for Family",
    description: "A festive gift for family members",
    value: 100,
    category: "Holiday",
    image: "/images/gift4.jpg",
    createdAt: "2025-01-18T16:45:00Z",
    updatedAt: "2025-01-18T16:45:00Z",
  },
];

// Mock data for error scenarios
export const mockErrorCases = [
  {
    error: "Database connection failed",
    code: "DB_CONNECTION_ERROR",
    details: "Unable to connect to database server",
  },
  {
    error: "Invalid gift ID format",
    code: "INVALID_ID_ERROR",
    details: "Gift ID must be a valid number",
  },
  {
    error: "Gift not found",
    code: "GIFT_NOT_FOUND",
    details: "No gift record found with the specified ID",
  },
];

// Mock data for batch operations
export const mockBatchGifts = [
  {
    id: 1,
    name: "Team Celebration Gift",
    description: "A special gift for team members",
    value: 250,
    category: "Event",
    image: "/images/gift1.jpg",
  },
  {
    id: 2,
    name: "Friend Gift",
    description: "A thoughtful gift for a close friend",
    value: 150,
    category: "Personal",
    image: "/images/gift2.jpg",
  },
];

// Mock data for error reporting
export const mockErrorReport = {
  message: "An error occurred in the gift registry system",
  stack: "Error: Failed to process gift submission",
  timestamp: "2025-01-19T08:30:00Z",
  source: "gift-submission-service",
};

// Mock data for backup operations
export const mockBackupData = {
  gifts: mockGifts,
  backupId: "backup_20250119_0830",
  timestamp: "2025-01-19T08:30:00Z",
  status: "completed",
};
