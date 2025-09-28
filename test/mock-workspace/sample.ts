// Sample TypeScript file for testing keypress notifications
// This file contains TypeScript-specific syntax for comprehensive testing

// Interface definition - try copying this entire interface
interface User {
  readonly id: number;          // Select and copy this line
  name: string;                 // Try cutting this property
  email?: string;               // Test with optional properties
  preferences: UserPreferences; // Complex type reference
}

// Type alias for testing
type UserPreferences = {
  theme: 'light' | 'dark';      // Union types for testing
  notifications: boolean;       // Try copying boolean type
  language: string;
};

// Generic interface - good for testing complex selections
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: number): Promise<void>;
  findAll(): Promise<T[]>;
}

// Sample class with TypeScript features
class UserService implements Repository<User> {
  private users: User[] = [];   // Private field - try copying
  
  constructor(private logger: Console) { // Constructor parameter properties
    this.logger.log('UserService initialized');
  }
  
  // Async method - test copying async/await syntax
  async findById(id: number): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return user || null;
  }
  
  // Method with destructuring - good for selection testing
  async save(user: User): Promise<User> {
    const { id, name } = user;
    
    if (!name.trim()) {
      throw new Error('Name is required');
    }
    
    const existingIndex = this.users.findIndex(u => u.id === id);
    if (existingIndex >= 0) {
      this.users[existingIndex] = user;
    } else {
      this.users.push(user);
    }
    
    return user;
  }
  
  // Arrow function property - try copying this
  delete = async (id: number): Promise<void> => {
    this.users = this.users.filter(u => u.id !== id);
  }
  
  async findAll(): Promise<User[]> {
    return [...this.users]; // Spread operator
  }
}

// Enum for testing
enum Status {
  PENDING = 'pending',      // Try copying enum values
  COMPLETED = 'completed',  // Test cutting and pasting enums
  CANCELLED = 'cancelled'
}

// Generic function with constraints
function createPair<T extends string | number>(
  first: T,
  second: T
): [T, T] {
  return [first, second];   // Tuple return type
}

// Complex type with mapped types and conditionals
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
};

// Utility types testing - commented out to avoid unused type errors
// type PartialUser = Partial<User>;      // Try copying utility types
// type RequiredUser = Required<User>;    // Test with different utilities
// type UserEmail = Pick<User, 'email'>;  // Pick specific properties

// Sample data for testing - try copying these objects
const sampleUser: User = {
  id: 1,
  name: 'Alice Johnson',
  email: 'alice@example.com',
  preferences: {
    theme: 'dark',
    notifications: true,
    language: 'en'
  }
};

const sampleResponse: ApiResponse<User> = {
  data: sampleUser,
  status: 200,
  message: 'Success',
  timestamp: new Date()
};

// Advanced TypeScript features for testing
namespace Utils {
  export function formatUser(user: User): string {
    return `${user.name} (${user.email || 'No email'})`;
  }
  
  export const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'light',
    notifications: true,
    language: 'en'
  };
}

// Decorator example (experimental) - commented out for compatibility
/*
function log(_target: any, _propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${_propertyName} with`, args);
    return method.apply(this, args);
  };
  return descriptor;
}
*/

class TestService {
  // @log  // Try copying decorators (commented for compatibility)
  process(data: string): string {
    return data.toUpperCase();
  }
}

// Export everything for module testing
export {
  User,
  UserPreferences,
  UserService,
  Status,
  createPair,
  ApiResponse,
  Utils,
  TestService,
  sampleUser,
  sampleResponse
};