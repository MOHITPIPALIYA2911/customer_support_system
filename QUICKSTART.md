# Quick Start Guide

Get up and running with the KRUX Finance Customer Support System in 5 minutes!

## 🚀 Installation

```bash
# 1. Navigate to project directory
cd customer-support-system

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Visit http://localhost:3000
```

## 🎯 Quick Tour

### Landing Page (`/`)
- Overview of the system
- Links to both interfaces
- Demo credentials displayed

### Customer Chat (`/customer-chat`)

**Demo Login Options:**
- **Rahul Sharma**: `+919876543210`
- **Priya Patel**: `+919876543211`

**What to Try:**
1. Click "Apply for a loan" → Select "Business Loan"
2. Click "Check application status" → Enter `LA-2024-001`
3. Click "Document requirements" → Select any loan type
4. Click "Speak with an agent" → Creates support ticket

### Support Dashboard (`/support-dashboard`)

**Demo Login Options:**
- **Amit Kumar**: `amit.kumar`
- **Sneha Singh**: `sneha.singh`

**What to Try:**
1. View the ticket queue (left panel)
2. Click on a ticket to open conversation
3. Send a message to the customer
4. Try "Quick Replies" button for templates
5. Click "Add Note" for internal notes
6. Click "Resolve" to close the ticket

## 🧪 Testing Real-time Sync

### Test in Two Browser Windows

**Window 1: Customer Chat**
1. Login as Rahul Sharma (`+919876543210`)
2. Click "Speak with an agent"
3. Send a message: "I need help with my loan"

**Window 2: Support Dashboard**
1. Login as Amit Kumar (`amit.kumar`)
2. You'll see the new ticket appear in queue
3. Click on the ticket to open
4. Reply to the customer
5. Customer will see your message in Window 1!

## 💡 Pro Tips

### For Customer Interface
- Press `Enter` to send messages
- Press `Shift + Enter` for new line
- Bot responds automatically with options
- Click any option button for quick actions

### For Agent Dashboard
- Use Quick Replies for common responses
- Add Internal Notes for team communication
- Filter tickets by status/priority
- Assign yourself to tickets automatically

## 📱 Mobile Testing

The app is mobile-first! Test on:
- iPhone (Safari)
- Android (Chrome)
- Tablet devices

### Mobile Access
```bash
# Find your local IP
# Mac/Linux:
ifconfig | grep "inet "

# Windows:
ipconfig

# Access from phone:
http://YOUR_IP:3000
```

## 🔄 Reset Demo Data

To clear all data and start fresh:

```javascript
// Open browser console (F12)
localStorage.clear();
location.reload();
```

## 🎨 Customization

### Change Branding Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    500: '#0ea5e9', // Change this
    600: '#0284c7', // And this
  },
}
```

### Add New Bot Responses

Edit `utils/botFlows.ts`:
```typescript
export const getBotResponse = (flowType: BotFlowType) => {
  // Add your custom flows here
}
```

### Add New Quick Replies

Edit `utils/mockData.ts`:
```typescript
export const MOCK_QUICK_REPLIES = [
  // Add your templates here
]
```

## 🐛 Common Issues

### Port 3000 Already in Use
```bash
# Kill process on port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
npm run dev -- -p 3001
```

### Styles Not Loading
```bash
# Rebuild Tailwind
rm -rf .next
npm run dev
```

### TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf .next
npm run build
```

## 📊 Test Scenarios

### Scenario 1: New Loan Application
1. Customer logs in
2. Asks about business loan
3. Bot provides requirements
4. Customer requests agent help
5. Agent assists and resolves

### Scenario 2: Status Check
1. Customer logs in
2. Checks status with ID: `LA-2024-001`
3. Bot shows status: Under Review
4. Customer satisfied, ends chat

### Scenario 3: Escalation
1. Customer has complex query
2. Bot cannot answer
3. Customer clicks "Speak with agent"
4. Agent picks up ticket
5. Agent resolves issue

## 🚀 Next Steps

1. **Explore All Features**
   - Try all bot conversation flows
   - Test all agent tools
   - Check mobile responsiveness

2. **Read Documentation**
   - `README.md` - Full documentation
   - `FEATURES.md` - Feature list
   - `DEPLOYMENT.md` - Deployment guide

3. **Customize**
   - Update branding colors
   - Add more bot flows
   - Create custom quick replies

4. **Deploy**
   - Push to GitHub
   - Deploy to Vercel
   - Share demo link

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [React Context](https://react.dev/reference/react/useContext)

## 🆘 Need Help?

- Check `README.md` for detailed docs
- Review code comments
- Check console for errors (F12)

---

**Ready to start?** Run `npm run dev` and visit `http://localhost:3000`! 🎉

