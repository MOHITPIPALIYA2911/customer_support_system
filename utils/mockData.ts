import { Customer, Agent, LoanApplication, QuickReply } from '@/types';

// Mock Customers
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Rahul Sharma',
    role: 'customer',
    phone: '+919876543210',
    email: 'rahul.sharma@example.com',
    username: 'rahul.sharma',
  },
  {
    id: 'cust-2',
    name: 'Priya Patel',
    role: 'customer',
    phone: '+919876543211',
    email: 'priya.patel@example.com',
    username: 'priya.patel',
  },
];

// Mock customer credentials (username -> password)
export const CUSTOMER_CREDENTIALS: Record<string, string> = {
  'rahul.sharma': 'password123',
  'priya.patel': 'password123',
};

// Mock Agents
export const MOCK_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: 'Amit Kumar',
    role: 'agent',
    username: 'amit.kumar',
    email: 'amit.kumar@krux.com',
    status: 'online',
  },
  {
    id: 'agent-2',
    name: 'Sneha Singh',
    role: 'agent',
    username: 'sneha.singh',
    email: 'sneha.singh@krux.com',
    status: 'online',
  },
];

// Mock agent credentials (username -> password)
export const AGENT_CREDENTIALS: Record<string, string> = {
  'amit.kumar': 'password123',
  'sneha.singh': 'password123',
};

// Mock Loan Applications
export const MOCK_LOAN_APPLICATIONS: LoanApplication[] = [
  {
    id: 'LA-2024-001',
    customerId: 'cust-1',
    type: 'Business',
    amount: 500000,
    status: 'under_review',
    appliedDate: '2024-10-15',
    lastUpdated: '2024-10-28',
    documents: ['PAN Card', 'Aadhaar Card', 'Business Registration'],
  },
  {
    id: 'LA-2024-002',
    customerId: 'cust-2',
    type: 'Personal',
    amount: 200000,
    status: 'approved',
    appliedDate: '2024-10-10',
    lastUpdated: '2024-10-25',
    documents: ['PAN Card', 'Aadhaar Card', 'Salary Slips'],
  },
];

// Mock Quick Replies
export const MOCK_QUICK_REPLIES: QuickReply[] = [
  {
    id: 'qr-1',
    title: 'Welcome Message',
    content: 'Hello! Welcome to KRUX Finance. How may I assist you today?',
    category: 'greeting',
  },
  {
    id: 'qr-2',
    title: 'Document List - Business Loan',
    content: 'For a Business Loan, you need: 1) PAN Card 2) Aadhaar Card 3) Business Registration Certificate 4) Last 6 months bank statements 5) ITR for last 2 years',
    category: 'documents',
  },
  {
    id: 'qr-3',
    title: 'Document List - Personal Loan',
    content: 'For a Personal Loan, you need: 1) PAN Card 2) Aadhaar Card 3) Last 3 months salary slips 4) Bank statements for last 6 months',
    category: 'documents',
  },
  {
    id: 'qr-4',
    title: 'Application Status Query',
    content: 'Let me check your application status. Could you please provide your Application ID?',
    category: 'status',
  },
  {
    id: 'qr-5',
    title: 'Transfer to Senior Agent',
    content: 'I understand your concern. Let me transfer you to a senior agent who can better assist you.',
    category: 'escalation',
  },
  {
    id: 'qr-6',
    title: 'Closing Message',
    content: 'Thank you for contacting KRUX Finance. Is there anything else I can help you with today?',
    category: 'closing',
  },
];

// Helper function to get customer by phone
export const getCustomerByPhone = (phone: string): Customer | undefined => {
  return MOCK_CUSTOMERS.find(c => c.phone === phone);
};

// Helper function to get customer by username
export const getCustomerByUsername = (username: string): Customer | undefined => {
  return MOCK_CUSTOMERS.find(c => c.username === username);
};

// Helper function to verify customer credentials
export const verifyCustomerCredentials = (username: string, password: string): Customer | undefined => {
  const customer = getCustomerByUsername(username);
  if (customer && CUSTOMER_CREDENTIALS[username] === password) {
    return customer;
  }
  return undefined;
};

// Helper function to get agent by username
export const getAgentByUsername = (username: string): Agent | undefined => {
  return MOCK_AGENTS.find(a => a.username === username);
};

// Helper function to verify agent credentials
export const verifyAgentCredentials = (username: string, password: string): Agent | undefined => {
  const agent = getAgentByUsername(username);
  if (agent && AGENT_CREDENTIALS[username] === password) {
    return agent;
  }
  return undefined;
};

// Helper function to get loan applications by customer ID
export const getLoanApplicationsByCustomerId = (customerId: string): LoanApplication[] => {
  return MOCK_LOAN_APPLICATIONS.filter(la => la.customerId === customerId);
};

// Helper function to get loan application by ID
export const getLoanApplicationById = (applicationId: string): LoanApplication | undefined => {
  return MOCK_LOAN_APPLICATIONS.find(la => la.id === applicationId);
};

