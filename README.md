# HyperAgent — Your AI Workforce                                                                                                                                                                        
                                                                    
  HyperAgent lets any business owner paste their website or Google Maps link and instantly get a custom AI agent team built for them — no technical knowledge required.                                   
   
  ## What it does                                                                                                                                                                                         
                                                            
  1. User pastes a business URL or Google Maps link                                                                                                                                                       
  2. Platform researches the business and identifies its type                                                                                                                                             
  3. A custom team of AI agents spawns live on screen (customer service, scheduling, SEO, follow-up, etc.)                                                                                                
  4. User can click any agent to configure it — add a phone number, edit the master prompt, connect to Slack/WhatsApp/Telegram/email, rename it, and chat with it directly                                
                                                                                                                                                                                                          
  ## Tech stack                                                                                                                                                                                           
                                                                                                                                                                                                          
  **Frontend (this repo)**                                  
  - React 18 + Vite 5
  - Plain JSX, no TypeScript                                                                                                                                                                              
  - CSS custom properties (no Tailwind, no component library)
                                                                                                                                                                                                          
  **Backend (Node — to be built)**                                                                                                                                                                        
  - Expected at `http://localhost:3001`                                                                                                                                                                   
  - Proxied via Vite: `/api` → `http://localhost:3001`                                                                                                                                                    
                                                                                                                                                                                                          
  ## Getting started
                                                                                                                                                                                                          
  ```bash                                                   
  npm install
  npm run dev

  The frontend runs fully in mock mode with no backend required. When the backend is running, it takes over automatically via the proxy.                                                                  
   
  Backend contract                                                                                                                                                                                        
                                                            
  The frontend calls:

  POST /api/analyze
  Content-Type: application/json

  { "url": "https://example.com" }                                                                                                                                                                        
   
  The backend should respond with Server-Sent Events (SSE) streamed over the response body. Use fetch + ReadableStream on the client — NOT EventSource (which doesn't support POST).                      
                                                            
  Event types                                                                                                                                                                                             
                                                            
  data: {"type":"business_identified","data":{"name":"Joe's Pizza","businessType":"Restaurant","emoji":"🍕"}}
                                                                                                                                                                                                          
  data: {"type":"agent_spawned","data":{"id":"agent-1","name":"Reservation Agent","icon":"calendar","color":"#2563EB","role":"Bookings & Scheduling","tasks":["Take reservations via phone","Send         
  confirmation texts","Handle cancellations"]}}                                                                                                                                                           
                                                                                                                                                                                                          
  data: {"type":"spawn_complete"}                           

  Send agent_spawned once per agent (4 agents recommended). End with spawn_complete.                                                                                                                      
   
  Icon values                                                                                                                                                                                             
                                                            
  Use one of these strings for the icon field — they map to SVG icons in the UI:                                                                                                                          
                                                            
  headset calendar star phone clipboard gear user file dollar megaphone                                                                                                                                   
                                                            
  Business types                                                                                                                                                                                          
                                                            
  Returning one of these in businessType gives the best UI labeling:                                                                                                                                      
   
  Restaurant Medical Dental Law Firm Salon — anything else renders as-is.                                                                                                                                 
                                                            
  Project structure                                                                                                                                                                                       
                                                            
  src/                                                                                                                                                                                                    
    components/                                             
      IntakeScreen.jsx      # URL input / landing hero
      ResearchScreen.jsx    # Analyzing animation
      SpawnScreen.jsx       # Agent grid + modal wiring                                                                                                                                                   
      AgentCard.jsx         # Individual agent card with typewriter effect                                                                                                                                
      AgentModal.jsx        # Right-panel: Chat / Profile / Prompt / Integrations                                                                                                                         
    utils/                                                                                                                                                                                                
      businessAnalyzer.js   # Calls /api/analyze; falls back to mock
      agentTemplates.js     # Mock agent definitions per business type                                                                                                                                    
                                                            
  Mock mode                                                                                                                                                                                               
                                                            
  If the backend is not running, businessAnalyzer.js falls back to mockAnalyze() which streams fake events with realistic delays. No errors, no blank screens — the demo works standalone.                
   
  Design                                                                                                                                                                                                  
                                                            
  Warm cream background (#F5F4F1), white cards, #0A0A0A text and accents. DM Sans + DM Mono fonts. Inspired by this landing page (https://andersonscat.github.io/agent-messenger-landing/).               
  ```
