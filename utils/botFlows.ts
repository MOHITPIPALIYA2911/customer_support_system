import { BotResponse, BotFlowType } from "@/types";
import { getLoanApplicationById } from "./mockData";

// Bot conversation flows
export const getBotResponse = (flowType: BotFlowType, userInput?: string): BotResponse => {
  switch (flowType) {
    case "greeting":
      return {
        message:
          "Hello! Welcome to KRUX Finance. I'm here to help you with your loan application needs. How can I assist you today?",
        options: [
          {
            id: "opt-1",
            label: "💼 Apply for a loan",
            value: "apply_loan",
            nextFlow: "loan_application",
          },
          {
            id: "opt-2",
            label: "📄 Document requirements",
            value: "documents",
            nextFlow: "document_requirements",
          },
          {
            id: "opt-3",
            label: "🔍 Check application status",
            value: "status",
            nextFlow: "status_check",
          },
          {
            id: "opt-4",
            label: "👤 Speak with an agent",
            value: "agent",
            nextFlow: "escalation",
          },
        ],
      };

    case "loan_application":
      return {
        message: "Great! I can help you with your loan application. We offer three types of loans:",
        options: [
          {
            id: "loan-1",
            label: "🏢 Business Loan",
            value: "business",
          },
          {
            id: "loan-2",
            label: "👤 Personal Loan",
            value: "personal",
          },
          {
            id: "loan-3",
            label: "🏭 MSME Loan",
            value: "msme",
          },
        ],
      };

    case "document_requirements":
      return {
        message:
          "I can help you understand the document requirements. Which type of loan are you interested in?",
        options: [
          {
            id: "doc-1",
            label: "Business Loan",
            value: "business_docs",
          },
          {
            id: "doc-2",
            label: "Personal Loan",
            value: "personal_docs",
          },
          {
            id: "doc-3",
            label: "MSME Loan",
            value: "msme_docs",
          },
        ],
      };

    case "status_check":
      return {
        message:
          "I can help you check your application status. Please provide your Application ID (e.g., LA-2024-001):",
        requiresInput: true,
        inputType: "text",
      };

    case "escalation":
      return {
        message:
          "I understand you'd like to speak with a human agent. Let me connect you with one of our customer support executives. They'll be with you shortly.",
        options: [],
      };

    case "general_query":
      return {
        message:
          "I'm here to help! Could you please provide more details about your query, or choose from one of the main options?",
        options: [
          {
            id: "gen-1",
            label: "Loan Application",
            value: "apply_loan",
            nextFlow: "loan_application",
          },
          {
            id: "gen-2",
            label: "Document Requirements",
            value: "documents",
            nextFlow: "document_requirements",
          },
          {
            id: "gen-3",
            label: "Check Status",
            value: "status",
            nextFlow: "status_check",
          },
          {
            id: "gen-4",
            label: "Talk to Agent",
            value: "agent",
            nextFlow: "escalation",
          },
        ],
      };

    default:
      return {
        message: "I'm not sure I understand. Let me help you with the main options:",
        options: [
          {
            id: "def-1",
            label: "Apply for Loan",
            value: "apply_loan",
            nextFlow: "loan_application",
          },
          {
            id: "def-2",
            label: "Document Requirements",
            value: "documents",
            nextFlow: "document_requirements",
          },
          {
            id: "def-3",
            label: "Check Status",
            value: "status",
            nextFlow: "status_check",
          },
        ],
      };
  }
};

// Handle specific user selections
export const handleUserSelection = (selection: string): BotResponse => {
  // Loan type selections
  if (selection === "business" || selection === "business_docs") {
    return {
      message:
        "**Business Loan Requirements:**\n\n✓ PAN Card\n✓ Aadhaar Card\n✓ Business Registration Certificate\n✓ Last 6 months bank statements\n✓ ITR for last 2 years\n✓ Business address proof\n\n**Loan Amount:** Up to ₹50 lakhs\n**Interest Rate:** Starting from 10.5% p.a.\n**Processing Time:** 3-5 business days\n\nWould you like to proceed with the application?",
      options: [
        {
          id: "proceed-1",
          label: "Yes, proceed",
          value: "proceed_business",
        },
        {
          id: "proceed-2",
          label: "Talk to agent",
          value: "agent",
          nextFlow: "escalation",
        },
        {
          id: "proceed-3",
          label: "Back to main menu",
          value: "main_menu",
          nextFlow: "greeting",
        },
      ],
    };
  }

  if (selection === "personal" || selection === "personal_docs") {
    return {
      message:
        "**Personal Loan Requirements:**\n\n✓ PAN Card\n✓ Aadhaar Card\n✓ Last 3 months salary slips\n✓ Bank statements for last 6 months\n✓ Employment proof\n\n**Loan Amount:** Up to ₹25 lakhs\n**Interest Rate:** Starting from 11.5% p.a.\n**Processing Time:** 2-3 business days\n\nWould you like to proceed with the application?",
      options: [
        {
          id: "proceed-1",
          label: "Yes, proceed",
          value: "proceed_personal",
        },
        {
          id: "proceed-2",
          label: "Talk to agent",
          value: "agent",
          nextFlow: "escalation",
        },
        {
          id: "proceed-3",
          label: "Back to main menu",
          value: "main_menu",
          nextFlow: "greeting",
        },
      ],
    };
  }

  if (selection === "msme" || selection === "msme_docs") {
    return {
      message:
        "**MSME Loan Requirements:**\n\n✓ PAN Card\n✓ Aadhaar Card\n✓ MSME Registration Certificate\n✓ Last 12 months bank statements\n✓ ITR for last 3 years\n✓ Business financials\n\n**Loan Amount:** Up to ₹1 crore\n**Interest Rate:** Starting from 9.5% p.a.\n**Processing Time:** 5-7 business days\n\nWould you like to proceed with the application?",
      options: [
        {
          id: "proceed-1",
          label: "Yes, proceed",
          value: "proceed_msme",
        },
        {
          id: "proceed-2",
          label: "Talk to agent",
          value: "agent",
          nextFlow: "escalation",
        },
        {
          id: "proceed-3",
          label: "Back to main menu",
          value: "main_menu",
          nextFlow: "greeting",
        },
      ],
    };
  }

  // Proceed selections
  if (selection.startsWith("proceed_")) {
    const loanType = selection.replace("proceed_", "");
    return {
      message: `Great! To proceed with your ${
        loanType.charAt(0).toUpperCase() + loanType.slice(1)
      } Loan application, I'll connect you with one of our loan specialists who will guide you through the process.\n\nYou can also start your application online at our website or visit the nearest KRUX Finance branch.\n\nIs there anything else I can help you with?`,
      options: [
        {
          id: "final-1",
          label: "Talk to specialist",
          value: "agent",
          nextFlow: "escalation",
        },
        {
          id: "final-2",
          label: "Back to main menu",
          value: "main_menu",
          nextFlow: "greeting",
        },
      ],
    };
  }

  // Default response
  return getBotResponse("general_query");
};

// Check application status
export const checkApplicationStatus = (applicationId: string): BotResponse => {
  const application = getLoanApplicationById(applicationId.toUpperCase());

  if (!application) {
    return {
      message: `I couldn't find an application with ID "${applicationId}". Please check the Application ID and try again, or contact our support team for assistance.`,
      options: [
        {
          id: "status-retry",
          label: "Try again",
          value: "status",
          nextFlow: "status_check",
        },
        {
          id: "status-agent",
          label: "Talk to agent",
          value: "agent",
          nextFlow: "escalation",
        },
        {
          id: "status-menu",
          label: "Main menu",
          value: "main_menu",
          nextFlow: "greeting",
        },
      ],
    };
  }

  const statusMessages: Record<string, string> = {
    pending:
      "Your application is pending review. Our team will review it within 1-2 business days.",
    under_review: "Your application is currently under review by our loan committee.",
    approved: "🎉 Congratulations! Your application has been approved.",
    rejected: "Unfortunately, your application was not approved at this time.",
    disbursed: "✅ Your loan has been disbursed to your account.",
  };

  return {
    message: `**Application Status for ${applicationId}**\n\n📋 Loan Type: ${
      application.type
    } Loan\n💰 Amount: ₹${application.amount.toLocaleString("en-IN")}\n📅 Applied: ${
      application.appliedDate
    }\n🔄 Status: ${application.status.replace("_", " ").toUpperCase()}\n\n${
      statusMessages[application.status]
    }\n\nLast Updated: ${application.lastUpdated}`,
    options: [
      {
        id: "status-details",
        label: "Talk to agent for details",
        value: "agent",
        nextFlow: "escalation",
      },
      {
        id: "status-menu",
        label: "Back to main menu",
        value: "main_menu",
        nextFlow: "greeting",
      },
    ],
  };
};
