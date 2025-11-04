# KRUX Finance - Customer Support System

A comprehensive dual-interface customer support system built with Next.js 14, TypeScript, and Tailwind CSS. This application demonstrates a production-ready customer support platform with AI-powered chatbot and real-time agent dashboard.

## 🎯 Project Overview

This project implements a complete customer support system with two distinct interfaces:

1. **Customer Chatbot** - AI-powered chat interface for customers seeking loan assistance
2. **Support Executive Dashboard** - Professional dashboard for support agents to manage conversations and tickets

## ✨ Features Implemented

### Customer Chatbot Interface ✅
- ✅ Mobile-first responsive design (WhatsApp-like interface)
- ✅ AI-powered bot with intelligent conversation flows
- ✅ Loan application guidance (Business, Personal, MSME)
- ✅ Document requirement queries
- ✅ Application status checking
- ✅ Seamless escalation to human agents
- ✅ Real-time message synchronization
- ✅ Typing indicators and smooth animations
- ✅ Message timestamps and read receipts

### Support Executive Dashboard ✅
- ✅ Comprehensive ticket queue management
- ✅ Real-time chat with customers
- ✅ Customer information panel with loan history
- ✅ Quick reply templates for common queries
- ✅ Internal notes (private, not visible to customers)
- ✅ Ticket resolution and escalation
- ✅ Priority and category filtering
- ✅ Unread message counters
- ✅ Agent assignment system
- ✅ Multi-agent support

### Technical Implementation ✅
- ✅ Next.js 14+ with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ React Hook Form with Zod validation (ready for forms)
- ✅ Lucide React icons
- ✅ Context API for state management
- ✅ LocalStorage for data persistence
- ✅ Mock authentication system

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd customer-support-system
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔐 Demo Credentials

### Customer Accounts
Access the customer chat interface at `/customer-chat`

| Name | Phone Number |
|------|-------------|
| Rahul Sharma | +919876543210 |
| Priya Patel | +919876543211 |

### Agent Accounts
Access the support dashboard at `/support-dashboard`

| Name | Username |
|------|----------|
| Amit Kumar | amit.kumar |
| Sneha Singh | sneha.singh |

## 📱 Application Structure

```
customer-support-system/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── customer-chat/
│   │   └── page.tsx               # Customer chatbot interface
│   ├── support-dashboard/
│   │   └── page.tsx               # Support agent dashboard
│   ├── layout.tsx                 # Root layout with providers
│   └── globals.css                # Global styles
├── components/
│   ├── ChatMessage.tsx            # Message bubble component
│   ├── TypingIndicator.tsx        # Bot typing animation
│   ├── QuickOptions.tsx           # Bot quick action buttons
│   ├── CustomerLogin.tsx          # Customer authentication
│   ├── AgentLogin.tsx             # Agent authentication
│   ├── TicketCard.tsx             # Ticket queue item
│   ├── CustomerInfoPanel.tsx      # Customer details sidebar
│   └── QuickReplyPanel.tsx        # Agent quick reply templates
├── contexts/
│   ├── AuthContext.tsx            # Authentication state
│   └── ChatContext.tsx            # Chat and conversation state
├── types/
│   └── index.ts                   # TypeScript type definitions
├── utils/
│   ├── localStorage.ts            # Local storage utilities
│   ├── mockData.ts                # Mock users and data
│   └── botFlows.ts                # Bot conversation logic
└── README.md
```

## 🎨 Key Features Explained

### 1. Intelligent Bot Flows

The chatbot handles multiple conversation scenarios:

- **Greeting Flow**: Welcome message with main options
- **Loan Application**: Guide users through different loan types
- **Document Requirements**: Detailed requirements for each loan type
- **Status Check**: Real-time application status lookup
- **Escalation**: Seamless handoff to human agents

### 2. Real-time Synchronization

- Messages sync instantly between customer and agent interfaces
- Unread message counters update in real-time
- Agent assignments reflect immediately
- Status changes propagate across both interfaces

### 3. Data Persistence

All data is stored in browser localStorage:
- Conversation history
- User sessions
- Agent notes
- Message read status

### 4. Professional Agent Tools

- **Quick Replies**: Pre-defined response templates
- **Internal Notes**: Private notes not visible to customers
- **Ticket Management**: Resolve, escalate, or transfer tickets
- **Customer History**: View loan applications and past interactions
- **Priority Filtering**: Sort by priority, status, or assignment

## 🛠️ Technology Stack

- **Framework**: Next.js 14.2.0
- **Language**: TypeScript 5.4.5
- **Styling**: Tailwind CSS 3.4.3
- **Icons**: Lucide React 0.378.0
- **Forms**: React Hook Form 7.51.0
- **Validation**: Zod 3.23.0
- **State Management**: React Context API
- **Data Persistence**: Browser LocalStorage

## 📊 Bot Conversation Examples

### Example 1: Loan Application
```
Customer: Hi
Bot: Welcome to KRUX Finance! How can I assist you today?
     [Apply for a loan] [Document requirements] [Check status] [Speak with agent]
Customer: [Apply for a loan]
Bot: Great! We offer three types of loans:
     [Business Loan] [Personal Loan] [MSME Loan]
Customer: [Business Loan]
Bot: **Business Loan Requirements:**
     ✓ PAN Card
     ✓ Aadhaar Card
     ✓ Business Registration...
```

### Example 2: Application Status Check
```
Customer: Check my application status
Bot: Please provide your Application ID (e.g., LA-2024-001)
Customer: LA-2024-001
Bot: **Application Status for LA-2024-001**
     📋 Loan Type: Business Loan
     💰 Amount: ₹5,00,000
     🔄 Status: UNDER REVIEW
```

## 🔄 State Management

The application uses React Context API for global state:

### AuthContext
- User authentication
- Login/logout functionality
- Session persistence

### ChatContext
- Conversation management
- Message sending and receiving
- Agent assignment
- Status updates
- Internal notes

## 💾 Data Models

### Key Types
- `User`: Customer and Agent user types
- `Conversation`: Chat conversation with messages
- `Message`: Individual chat messages
- `LoanApplication`: Loan application data
- `QuickReply`: Agent quick reply templates

## 🎯 Future Enhancements

Potential features for production:
- Backend API integration
- Real-time WebSocket connections
- File upload functionality
- Voice input/output
- Advanced analytics dashboard
- Email notifications
- Multi-language support
- Dark mode theme

## 📝 Development Notes

### Code Quality
- Fully typed with TypeScript
- Component-based architecture
- Reusable utility functions
- Clean separation of concerns

### Performance
- Optimized re-renders with React Context
- Efficient localStorage operations
- Smooth animations and transitions
- Mobile-optimized scrolling

### Accessibility
- Semantic HTML
- Keyboard navigation support
- Screen reader friendly
- ARIA labels where needed

## 🐛 Troubleshooting

### Issue: Messages not syncing
**Solution**: Clear browser localStorage and refresh

### Issue: Authentication not persisting
**Solution**: Check browser localStorage is enabled

### Issue: Styles not loading
**Solution**: Run `npm run build` to rebuild

## 📄 License

This project is part of a technical assessment for KRUX Finance.

## 👨‍💻 Author

Built as a demonstration of modern React/Next.js development practices for customer support systems.

---

## 🚀 Deployment

This application can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **GitHub Pages** (with static export)

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Deploy with default settings

The application is stateless and uses localStorage, so no backend or database configuration is required.

---

**Note**: This is a demo application with mock data. In production, replace localStorage with a proper backend API and database.

