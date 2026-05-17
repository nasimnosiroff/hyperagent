export function classifyBusiness(url) {
  const s = (url || '').toLowerCase()
  if (/hospital|clinic|medical|health|care|doctor|physician|urgent/.test(s)) return 'medical'
  if (/dental|dentist|orthodont/.test(s)) return 'dental'
  if (/restaurant|cafe|bistro|pizza|grill|kitchen|food|diner|eatery|sushi|burger/.test(s)) return 'restaurant'
  if (/law|attorney|legal|lawyer|counsel|llp|llc.*law/.test(s)) return 'law'
  if (/salon|spa|beauty|hair|nail|barber|wax|facial/.test(s)) return 'salon'
  return 'generic'
}

export function extractBusinessName(url) {
  try {
    // Google Maps /place/Business+Name/ — most common share format
    const placeMatch = url.match(/\/maps\/place\/([^/@?&]+)/)
    if (placeMatch) {
      return decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')).split(',')[0].trim()
    }

    // Google short links (maps.app.goo.gl, goo.gl/maps) — name not in URL
    if (/maps\.app\.goo\.gl|goo\.gl\/maps/i.test(url)) {
      return 'Your Business'
    }

    // Any other google.com/maps or maps.google.com without /place/ — name not in URL
    if (/google\.com\/maps|maps\.google\.com/i.test(url)) {
      return 'Your Business'
    }

    // Standard website: extract meaningful part of hostname
    const { hostname } = new URL(url.startsWith('http') ? url : `https://${url}`)
    const clean = hostname
      .replace(/^www\./, '')
      .replace(/\.(com|net|org|io|co|biz|us|app|ai).*$/, '')
    // Take the last meaningful segment (e.g. "marios-kitchen" from "marios-kitchen.myshopify")
    const parts = clean.split('.').filter(p => p.length > 2)
    const name = (parts[parts.length - 1] || clean)
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
    return name || 'Your Business'
  } catch {
    return 'Your Business'
  }
}

export const AGENT_TEMPLATES = {
  restaurant: {
    displayType: 'Restaurant & Food Service',
    emoji: '🍽️',
    agents: [
      {
        id: 'cs', name: 'Customer Service', icon: 'headset', color: '#22D3EE',
        role: 'Customer Relations',
        tasks: ['Answers inbound calls & questions', 'Handles complaints & feedback', 'Provides menu & hours info'],
      },
      {
        id: 'res', name: 'Reservations', icon: 'calendar', color: '#818CF8',
        role: 'Booking & Scheduling',
        tasks: ['Books & confirms reservations', 'Sends reminder messages', 'Manages cancellations'],
      },
      {
        id: 'seo', name: 'SEO & Reviews', icon: 'star', color: '#F59E0B',
        role: 'Online Presence',
        tasks: ['Responds to Google reviews', 'Runs local SEO campaigns', 'Manages Google Business listing'],
      },
      {
        id: 'ops', name: 'Operations', icon: 'gear', color: '#10B981',
        role: 'Internal Workflows',
        tasks: ['Coordinates staff schedules', 'Updates CRM & records', 'Sends daily summary reports'],
      },
    ],
  },
  medical: {
    displayType: 'Healthcare',
    emoji: '🏥',
    agents: [
      {
        id: 'followup', name: 'Patient Follow-up', icon: 'phone', color: '#22D3EE',
        role: 'Post-Visit Care',
        tasks: ['Calls patients 24h after discharge', 'Asks structured health questions', 'Updates records in CRM'],
      },
      {
        id: 'appt', name: 'Appointment Scheduling', icon: 'calendar', color: '#818CF8',
        role: 'Scheduling',
        tasks: ['Books & confirms appointments', 'Sends patient reminders', 'Handles reschedule requests'],
      },
      {
        id: 'intake', name: 'Intake Coordinator', icon: 'clipboard', color: '#F59E0B',
        role: 'Patient Intake',
        tasks: ['Collects patient information', 'Verifies insurance details', 'Prepares intake forms'],
      },
      {
        id: 'admin', name: 'Admin Support', icon: 'gear', color: '#10B981',
        role: 'Administration',
        tasks: ['Updates EHR systems', 'Manages billing workflows', 'Coordinates referrals'],
      },
    ],
  },
  dental: {
    displayType: 'Dental Practice',
    emoji: '🦷',
    agents: [
      {
        id: 'appt', name: 'Appointment Scheduler', icon: 'calendar', color: '#22D3EE',
        role: 'Scheduling',
        tasks: ['Books & confirms appointments', 'Sends reminders', 'Handles cancellations'],
      },
      {
        id: 'cs', name: 'Patient Service', icon: 'headset', color: '#818CF8',
        role: 'Patient Relations',
        tasks: ['Answers patient questions', 'Handles insurance inquiries', 'Manages feedback'],
      },
      {
        id: 'recall', name: 'Recall Agent', icon: 'phone', color: '#F59E0B',
        role: 'Preventive Care',
        tasks: ['Calls patients due for checkup', 'Sends recall reminders', 'Reactivates inactive patients'],
      },
      {
        id: 'billing', name: 'Billing Support', icon: 'dollar', color: '#10B981',
        role: 'Finance',
        tasks: ['Verifies insurance benefits', 'Sends billing statements', 'Tracks payment plans'],
      },
    ],
  },
  law: {
    displayType: 'Law Firm',
    emoji: '⚖️',
    agents: [
      {
        id: 'intake', name: 'Client Intake', icon: 'user', color: '#22D3EE',
        role: 'New Client Relations',
        tasks: ['Qualifies new case inquiries', 'Collects case information', 'Schedules consultations'],
      },
      {
        id: 'docs', name: 'Document Processing', icon: 'file', color: '#818CF8',
        role: 'Document Management',
        tasks: ['Organizes case documents', 'Prepares standard filings', 'Tracks deadlines & dates'],
      },
      {
        id: 'sched', name: 'Scheduling', icon: 'calendar', color: '#F59E0B',
        role: 'Calendar Management',
        tasks: ['Coordinates court dates', 'Books client meetings', 'Sends reminders'],
      },
      {
        id: 'billing', name: 'Billing & Invoicing', icon: 'dollar', color: '#10B981',
        role: 'Finance',
        tasks: ['Tracks billable hours', 'Sends payment reminders', 'Generates invoices'],
      },
    ],
  },
  salon: {
    displayType: 'Salon & Beauty',
    emoji: '💅',
    agents: [
      {
        id: 'booking', name: 'Booking Agent', icon: 'calendar', color: '#22D3EE',
        role: 'Appointments',
        tasks: ['Books & confirms appointments', 'Sends SMS reminders', 'Handles rescheduling'],
      },
      {
        id: 'cs', name: 'Client Service', icon: 'headset', color: '#818CF8',
        role: 'Client Relations',
        tasks: ['Answers calls & messages', 'Handles service inquiries', 'Manages client preferences'],
      },
      {
        id: 'mktg', name: 'Marketing', icon: 'star', color: '#F59E0B',
        role: 'Growth & Reviews',
        tasks: ['Collects Google reviews', 'Runs referral campaigns', 'Sends promotions'],
      },
      {
        id: 'ops', name: 'Operations', icon: 'gear', color: '#10B981',
        role: 'Workflows',
        tasks: ['Tracks product inventory', 'Coordinates staff schedules', 'Manages loyalty program'],
      },
    ],
  },
  generic: {
    displayType: 'Business',
    emoji: '🏢',
    agents: [
      {
        id: 'cs', name: 'Customer Service', icon: 'headset', color: '#22D3EE',
        role: 'Customer Relations',
        tasks: ['Answers inbound calls & messages', 'Handles inquiries & support', 'Collects customer feedback'],
      },
      {
        id: 'sales', name: 'Sales Outreach', icon: 'megaphone', color: '#818CF8',
        role: 'Growth',
        tasks: ['Runs cold email campaigns', 'Follows up on leads', 'Books sales calls'],
      },
      {
        id: 'sched', name: 'Scheduling', icon: 'calendar', color: '#F59E0B',
        role: 'Calendar Management',
        tasks: ['Books meetings & appointments', 'Sends reminders', 'Manages calendar conflicts'],
      },
      {
        id: 'ops', name: 'Operations', icon: 'gear', color: '#10B981',
        role: 'Workflows',
        tasks: ['Updates CRM systems', 'Generates reports', 'Automates internal workflows'],
      },
    ],
  },
}
