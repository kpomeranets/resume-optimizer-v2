# ATS Resume Optimizer - Complete Application Specification (V2.0)
 
## Document Controls

- **Version**: 0.2.0 (Pre-Alpha - Technical Stack Defined)
- **Last Updated**: December 17, 2024
- **Status**: In Development - Architecture Finalized
- **Primary Developer**: Ken Pomeranets
- **AI Assistant**: Claude (Anthropic)
- **Repository**: https://github.com/kpomeranets/resume-optimizer-v2

---

## PROMPT MANAGEMENT RULES

### Purpose of This Document

This prompt.md file is the **single source of truth** for the entire ATS Resume Optimizer application. It is designed with sufficient detail that:

1. Any AI assistant (Claude, ChatGPT, etc.) can reproduce the entire application from scratch
2. Any developer can understand the complete system without additional documentation
3. All decisions, rationale, risks, and learnings are preserved
4. The application can be rebuilt if code is lost
5. Handoff to contractors or other developers is seamless

### Update Protocol

**CRITICAL RULE: The prompt must be updated BEFORE any code changes are made.**

#### Change Workflow

```
1. DISCUSS → Discuss proposed change/feature/decision
2. UPDATE PROMPT → Document in prompt.md with full context
3. REVIEW & APPROVE → Ken reviews and approves prompt updates
4. WRITE CODE → Implement code to match prompt specification
5. DOCUMENT LEARNINGS → Update prompt.md with discoveries during implementation
6. VERSION CONTROL → Commit prompt.md and code together
```

#### What Must Be Documented

Every change to the application requires documentation of:

- **WHAT**: The change being made
- **WHY**: The rationale and business/technical justification
- **ALTERNATIVES**: What other options were considered and why they were rejected
- **RISKS**: Potential issues, technical debt, or edge cases introduced
- **DECISIONS**: Any architectural or design choices made
- **LEARNINGS**: What was discovered during implementation
- **CONTEXT**: Any background information needed to understand the change

#### Version Control Convention

```
MAJOR.MINOR.PATCH

MAJOR (X.0.0) = Complete phase implemented (e.g., Phase 1 complete = 1.0.0)
MINOR (X.Y.0) = Significant feature added within a phase
PATCH (X.Y.Z) = Bug fix, minor improvement, or documentation update

Current: 0.2.0 (Pre-Alpha, technical stack finalized)
Next Milestone: 1.0.0 (Phase 1 - Analysis complete and working)
```

#### Change Log Format

Every update includes:

```markdown
## [Version X.X.X] - YYYY-MM-DD

### Added
- Description of new features with rationale

### Changed
- Description of modifications with reason

### Deprecated
- Features marked for removal with timeline

### Removed
- Deleted features with explanation

### Fixed
- Bug fixes with root cause

### Security
- Security-related changes

### Risks Identified
- New risks discovered with mitigation plans

### Decisions Made
- Key decisions with alternatives considered and rationale

### Lessons Learned
- Insights gained during implementation

### Technical Debt
- Shortcuts taken with plan to address
```

---

## Change Log

### [0.2.0] - December 17, 2024

#### Added
- Job URL fetching feature with server-side proxy
- "Cyber-Professional" design system with specific color palette
- Framer Motion animation specifications
- Diff viewer with syntax highlighting
- Interactive tooltips for keyword explanations
- Enhanced error handling for URL fetching
- Use case documentation (Technical Pivot, Blocked URL)

#### Changed
- Updated state management from React Context to Zustand
- Refined design aesthetic from generic to "Cyber-Professional"
- Added streaming response considerations for Claude API
- Enhanced clarifying questions to limit to 3 high-impact questions

#### Decisions Made
- **AI Provider: Anthropic Claude + Direct SDK**
  - *Alternatives*: OpenAI GPT-4, Google Gemini
  - *Rationale*: Best reasoning for structured tasks, 200K context window, prefer Anthropic's approach
  - *Tradeoff*: No native streaming in Anthropic SDK (can implement SSE manually if needed)
  
- **State Management: Zustand**
  - *Alternatives*: React Context, Redux
  - *Rationale*: Complex wizard state benefits from external store, cleaner than Context, simpler than Redux
  - *Tradeoff*: Additional dependency, but cleaner code

- **Job URL Fetching: Include in MVP**
  - *Alternatives*: Manual copy-paste only
  - *Rationale*: Significant UX improvement, differentiates from competitors
  - *Risk*: Sites may block (Cloudflare, LinkedIn) - mitigated with graceful fallback

- **Design System: "Cyber-Professional"**
  - *Alternatives*: Generic professional, Material Design
  - *Rationale*: Appeals to tech professionals, modern aesthetic, differentiates product
  - *Colors*: Navy (#0F172A), Electric Blue (#38BDF8), Slate (#94A3B8)

#### Risks Identified
- **URL Fetching Blocks**: Sites like LinkedIn may block server-side fetching
  - *Mitigation*: Graceful fallback to manual paste with clear modal messaging
  
- **Framer Motion Performance**: Complex animations may slow on lower-end devices
  - *Mitigation*: Use prefers-reduced-motion, provide disable option in settings

- **Zustand Learning Curve**: Team unfamiliar with Zustand
  - *Mitigation*: Comprehensive inline comments, documentation

### [0.1.0] - December 17, 2024

#### Added
- Initial project structure with Next.js + TypeScript
- Created GitHub repository
- Established comprehensive prompt.md as source of truth
- Defined complete 5-phase workflow specification

#### Decisions Made
- **Tech Stack: Next.js + TypeScript over Streamlit**
  - *Alternatives*: Python/Streamlit (faster MVP), vanilla React
  - *Rationale*: Better productization path, type safety, professional UI, easy deployment
  - *Tradeoff*: Steeper learning curve for beginner developer, but better long-term choice

- **Prompt-Driven Development Approach**
  - *Alternatives*: Traditional code-first development
  - *Rationale*: Ensures reproducibility, enables AI assistance, documents all decisions
  - *Benefit*: Can hand off to any developer/AI at any time

#### Risks Identified
- **Developer Experience Level**: Primary developer is beginner in React/Next.js/TypeScript
  - *Mitigation*: Extensive inline comments, comprehensive documentation, incremental learning
  
- **No API Key Yet**: Cannot test Claude integration until key obtained
  - *Mitigation*: Design API abstraction layer, can mock responses during development
  
- **Time Pressure**: Developer is actively job searching
  - *Mitigation*: Prioritize Phase 1 first, can use manual prompt workflow while building app

#### Lessons Learned
- User initially asked about switching to Claude Code, but determined that Chat + comprehensive prompt is better for learning phase
- Building comprehensive specification upfront saves time vs. discovering requirements during coding

---

## Project Overview

### Mission Statement

Build a production-grade web application that automates the optimization of resume bullets for Workday job applications by:
1. Analyzing job descriptions against resume content (with optional URL fetching)
2. Identifying ATS keyword gaps with semantic understanding
3. Ensuring authenticity through clarifying questions
4. Suggesting contextual bullet improvements
5. Generating Workday-ready formatted text with professional design
6. Creating archival Word documents

### Target User

**Primary User**: Ken Pomeranets
- Senior Technology Leader with 20+ years experience
- Currently job searching for Director/VP-level QA/Release Management roles
- Technical background but beginner in modern web development
- Needs efficient ATS optimization for multiple applications
- Values authenticity - will not fabricate experience
- Appreciates polished, professional tools

**Future Users** (post-MVP):
- Other job seekers in technical roles
- Career coaches helping clients
- Recruiters optimizing candidate resumes

### Core Value Proposition

**Current State (Pain)**: 
- Manual resume optimization takes 2-4 hours per application
- Difficult to track which keywords are missing
- Risk of accidentally fabricating experience
- Tedious copy-pasting of job descriptions from websites
- No standardized format for Workday applications
- No archive of what was submitted where

**Future State (Solution)**:
- Optimization process reduced to 20-30 minutes
- Systematic keyword gap analysis with semantic understanding
- Clarifying questions ensure authenticity (limit 3 questions max)
- One-click job description import from URL
- One-click Workday-formatted output
- Automatic archival documentation
- Professional, modern interface that inspires confidence

### Success Criteria

**MVP Success** (Version 1.0.0):
- Phase 1 (Analysis) works end-to-end
- URL fetching works for at least 50% of job sites
- Can analyze job description against resume
- Provides keyword gap analysis with categorization
- Takes 20 minutes instead of 2 hours
- Ken successfully uses it for at least 3 real applications
- UI feels professional and polished

**Full Product Success** (Version 5.0.0):
- All 5 phases implemented
- URL fetching works or gracefully fails for 95%+ of sites
- Generates Word document automatically
- 90%+ user satisfaction with edit suggestions
- Process takes 20 minutes end-to-end
- Zero fabricated experience incidents
- Animations and interactions feel smooth and professional

---

## Technical Stack

### Frontend Framework
**Next.js 15.x** with App Router
- *Why*: Server components, built-in API routes, optimal for our use case
- *Alternatives Considered*: Create React App (outdated), Vite (requires separate backend)
- *Version*: Latest stable at time of development

### Language
**TypeScript 5.x**
- *Why*: Type safety reduces bugs, better IDE support, self-documenting code
- *Alternatives Considered*: JavaScript (faster to write, but more bugs)
- *Learning Curve*: Accepted tradeoff for long-term code quality

### Styling
**Tailwind CSS 3.x + Custom CSS Modules**
- *Why*: Utility-first for layout, CSS Modules for complex glassmorphism effects
- *Alternatives Considered*: styled-components (runtime cost), pure Tailwind (limited for complex effects)
- *Note*: Tailwind for responsiveness/layout, CSS Modules for "Cyber-Professional" effects

### State Management
**Zustand 4.x**
- *Why*: Perfect for complex wizard state, cleaner than Context, simpler than Redux
- *Alternatives Considered*: React Context (too verbose for complex state), Redux (overkill)
- *Learning Curve*: Minimal API surface, easier to learn than Redux

### AI Integration
**Anthropic Claude API** (claude-sonnet-4-20250514)
- *Why*: Best reasoning capabilities for structured tasks, 200K context window, preferred approach
- *Alternatives Considered*: OpenAI GPT-4 (considered but Claude better for our use case), Google Gemini (less mature)
- *SDK*: @anthropic-ai/sdk (Direct SDK)
- *Cost Structure*: ~$3-15 per application (acceptable for user)
- *Note*: No native streaming, but can implement SSE for streaming responses if UX demands it

### Animation
**Framer Motion 10.x**
- *Why*: Best React animation library, smooth page transitions, success states
- *Alternatives Considered*: React Spring (more complex), CSS transitions (limited)
- *Use Cases*: Page transitions, success animations (confetti/checkmark), smooth wizard flow

### Document Generation
**docx (npm package)**
- *Why*: Pure JavaScript Word document generation, works in Node.js
- *Alternatives Considered*: python-docx (different language), Office.js (requires Office 365)

### File Upload
**react-dropzone**
- *Why*: Great UX, widely used, supports drag-and-drop
- *Alternatives Considered*: Native HTML input (works but poor UX)

### PDF/Word Parsing
**Server-Side Libraries:**
- **pdf-parse** - Extract text from PDF resumes
- **mammoth** - Extract text from DOCX files
- *Why Server-Side*: Better security, avoid CORS issues, larger files
- *Alternatives Considered*: Client-side parsing (security risk, file size limits)

### Deployment
**Vercel** (Next.js native platform)
- *Why*: Zero-config deployment, automatic HTTPS, global CDN, free tier, serverless functions
- *Alternatives Considered*: AWS (too complex), Netlify (works but Vercel is Next.js native)

### Version Control
**Git + GitHub**
- *Why*: Industry standard, free, integrated with deployment
- *Repository*: https://github.com/kpomeranets/resume-optimizer-v2

---

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          User Browser                                    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │         Next.js Frontend (React/TypeScript)                        │ │
│  │         Design: "Cyber-Professional" Dark Mode                     │ │
│  │                                                                     │ │
│  │  ┌──────────────────────────────────────────────────────────────┐ │ │
│  │  │           Zustand Global State Store                          │ │ │
│  │  │  - Wizard state (currentPhase, navigation)                    │ │ │
│  │  │  - Resume data (parsed text, roles, bullets)                  │ │ │
│  │  │  - Job data (description, URL, keywords)                      │ │ │
│  │  │  - Analysis results (gaps, suggestions, approvals)            │ │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  │                                                                     │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │ │
│  │  │ Phase 1  │→ │ Phase 2  │→ │ Phase 3  │→ │ Phase 4  │ → ...   │ │
│  │  │Input/    │  │Analysis  │  │Questions │  │Recommend │         │ │
│  │  │Ingest    │  │          │  │Wizard    │  │& Approve │         │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │ │
│  │                                                                     │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │        Framer Motion AnimatePresence                         │  │ │
│  │  │        (Smooth wizard transitions)                           │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                             │                                           │
│                             │ HTTP/HTTPS                                │
│                             ▼                                           │
└─────────────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┼─────────────────────────────────────────┐
│                    Next.js Server (API Routes)                         │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │              API Routes (Serverless Functions)                    │ │
│  │                                                                    │ │
│  │  /api/upload/parse          → Parse PDF/DOCX (pdf-parse/mammoth) │ │
│  │  /api/job/fetch             → Server-side URL proxy               │ │
│  │  /api/claude/analyze        → Phase 1 Analysis                    │ │
│  │  /api/claude/questions      → Phase 2A - Generate questions       │ │
│  │  /api/claude/recommendations → Phase 2B - Generate edits          │ │
│  │  /api/claude/finalize       → Phase 4 - Final output              │ │
│  │  /api/generate-docx         → Phase 5 - Word document             │ │
│  │                                                                    │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                             │                                          │
└─────────────────────────────┼──────────────────────────────────────────┘
                              │
                  ┌───────────┴────────────┐
                  │                        │
                  ▼                        ▼
          ┌───────────────┐      ┌─────────────────┐
          │ Anthropic API │      │  External Sites │
          │    (Claude)   │      │  (Job postings) │
          └───────────────┘      └─────────────────┘
                  │
                  ▼
          ┌───────────────┐
          │  docx Library │
          │  (Local Gen)  │
          └───────────────┘
```

### Data Flow

**Phase 1: Input & Ingestion (Multi-Mode)**
```
A. File Upload Path:
1. User drops PDF/DOCX file
2. Frontend shows "Parsing..." spinner
3. File sent to /api/upload/parse
4. Server uses pdf-parse or mammoth to extract text
5. If parsing fails (encrypted, corrupted):
   → Frontend shows "Could not read file" toast
   → Automatically reveals "Paste Text" textarea
   → User manually pastes resume text
6. Text stored in Zustand store
7. Validation: Must be >50 words
8. "Next" button enabled when validated

B. Job URL Fetching Path:
1. User pastes URL into input field
2. User clicks "Fetch Job Description"
3. Frontend sends URL to /api/job/fetch
4. Server-side proxy attempts to fetch URL content
5. Success Case:
   → Server extracts text, returns to frontend
   → Text populated in textarea
   → User can edit if needed
6. Failure Case (403/401/Cloudflare):
   → Modal appears: "Access Denied - This site blocks automated reading"
   → Modal provides "Copy-Paste Instead" button
   → User manually pastes job description
   → Modal closes, flow continues normally
7. Text stored in Zustand store
8. Validation: Must be >50 words
9. "Next" button enabled when both resume and job description validated

C. Manual Paste Path:
1. User pastes text directly into textareas
2. Real-time character count shown
3. Validation: Both must be >50 words
4. "Next" button enabled when validated
```

**Phase 2: AI Analysis (Deep Semantic Analysis)**
```
1. User clicks "Analyze"
2. Frontend sends resume + job description to /api/claude/analyze
3. API constructs system prompt (from Appendix A) + user data
4. Calls Claude API with full context
5. Claude performs:
   a. Extract hard skills (languages, tools) and soft skills (leadership, agile) from JD
   b. Cross-reference with resume text
   c. Categorize keywords:
      - CRITICAL MISSING: In JD >3 times, in resume 0 times
      - UNDERWEIGHTED: In JD >3 times, in resume once or only in "Skills" section
      - OPTIMIZED: Good balance
   d. Semantic understanding: Check if "Python" is appropriate for "Customer Service" role
   e. Identify which roles can authentically incorporate missing keywords
6. Claude returns structured analysis
7. Frontend displays:
   - Keywords in color-coded categories (red/yellow/green)
   - Role-by-role fit assessment
   - Priority tiers (Critical/High/Moderate)
8. State stored in Zustand
9. User clicks "Continue to Questions"
```

**Phase 3: Authenticity Wizard (Clarification Loop)**
```
1. Frontend sends analysis to /api/claude/questions
2. Claude analyzes "Critical Missing" keywords
3. Claude generates up to 3 high-impact questions:
   Example: "The job requires Kubernetes. Did you use K8s in your Docker projects at DocuSign?"
4. Questions returned in structured format
5. Frontend displays chat-like or form-like interface
6. For each question, user can:
   - Answer "Yes" with details
   - Answer "No"
   - Skip
7. Limit: Maximum 3 questions to avoid user fatigue
8. Answers stored in Zustand
9. User clicks "Generate Recommendations"
```

**Phase 4: Recommendation Engine (STAR Method Rewriting)**
```
1. Frontend sends analysis + Q&A to /api/claude/recommendations
2. Claude generates bullet rewrites:
   Input: Old Bullet + Context + User Answers + Target Keywords
   Method: STAR (Situation, Task, Action, Result)
   Constraint: Max 2 lines per bullet (standard resume format)
3. Claude returns numbered edits with options (1A, 1B, etc.)
4. Frontend displays Diff Viewer:
   - Green highlights for added text
   - Red strikethrough for deleted text
   - Interactive tooltips on keywords: "Added because 'Cloud Governance' appears 5x in JD"
5. User can:
   - Approve individual edits
   - Reject individual edits
   - Edit suggestion before accepting
   - "Approve All" for confidence
6. Approval decisions stored in Zustand
7. User clicks "Generate Final Output"
```

**Phase 5: Final Output & Export**
```
1. Frontend sends approved edits to /api/claude/finalize
2. Claude merges approved bullets with originals
3. Claude formats with hyphen-space (- ) for Workday compatibility
4. Frontend displays formatted sections per role with copy buttons
5. Success animation: Confetti or checkmark (Framer Motion)
6. User clicks "Download Word Document"
7. Frontend sends to /api/generate-docx with metadata
8. Server uses docx library to generate:
   Header: Name, Contact
   Body: Experience (optimized bullets), Skills (updated)
   Structure: ATS-compatible (Arial/Calibri, no tables)
   File naming: [Role]_[Company]_[Date].docx
9. File downloads to browser
10. User saves to chosen location
```

---

## Design System: "Cyber-Professional"

### Aesthetic Philosophy
Modern, sleek, and technical without being cold. Inspires confidence in the tool's sophistication while maintaining approachability.

### Color Palette

**Primary Colors:**
- **Deep Navy**: `#0F172A` (Background)
- **Electric Blue**: `#38BDF8` (Primary actions, highlights, links)
- **Muted Slate**: `#94A3B8` (Secondary text, borders, inactive states)

**Semantic Colors:**
- **Success Green**: `#10B981` (Approved edits, success states)
- **Warning Yellow**: `#FBBF24` (Underweighted keywords, cautions)
- **Error Red**: `#EF4444` (Missing keywords, errors)
- **Info Cyan**: `#06B6D4` (Tooltips, informational states)

**Backgrounds:**
- **Primary BG**: `#0F172A` (Main background)
- **Secondary BG**: `#1E293B` (Cards, panels)
- **Tertiary BG**: `#334155` (Hover states, elevated elements)

**Text:**
- **Primary Text**: `#F1F5F9` (Main content)
- **Secondary Text**: `#94A3B8` (Supporting content)
- **Tertiary Text**: `#64748B` (Metadata, timestamps)

### Typography

**Font Stack:**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Type Scale:**
- **Hero**: 48px / 3rem (Bold) - Landing page, major headers
- **H1**: 36px / 2.25rem (Semibold) - Page titles
- **H2**: 30px / 1.875rem (Semibold) - Section headers
- **H3**: 24px / 1.5rem (Medium) - Subsection headers
- **Body Large**: 18px / 1.125rem (Regular) - Prominent body text
- **Body**: 16px / 1rem (Regular) - Standard body text
- **Body Small**: 14px / 0.875rem (Regular) - Metadata, captions
- **Code**: 14px / 0.875rem (Mono) - Code blocks, formatted output

### Spacing System (8px base)
- **xs**: 4px / 0.25rem
- **sm**: 8px / 0.5rem
- **md**: 16px / 1rem
- **lg**: 24px / 1.5rem
- **xl**: 32px / 2rem
- **2xl**: 48px / 3rem
- **3xl**: 64px / 4rem

### Component Styling

**Buttons:**
```
Primary Action:
- Background: Electric Blue (#38BDF8)
- Text: Deep Navy (#0F172A)
- Hover: Lighten 10% (#60CCF9)
- Disabled: Muted Slate (#94A3B8) with reduced opacity

Secondary Action:
- Background: Transparent
- Border: Electric Blue (#38BDF8)
- Text: Electric Blue (#38BDF8)
- Hover: Background Electric Blue with 10% opacity
```

**Cards:**
```
- Background: Secondary BG (#1E293B)
- Border: 1px solid rgba(148, 163, 184, 0.1)
- Border Radius: 12px
- Box Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
- Hover: Subtle lift (translateY(-2px)) with deeper shadow
```

**Glassmorphism Effects:**
```
For overlay panels, modals:
- Background: rgba(30, 41, 59, 0.8)
- Backdrop Filter: blur(12px)
- Border: 1px solid rgba(148, 163, 184, 0.2)
```

### Motion Design (Framer Motion)

**Page Transitions:**
```typescript
const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
}

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3
}
```

**Success States:**
- **Approval Animation**: Checkmark with scale bounce
- **Completion**: Confetti explosion (react-confetti)
- **Copy Button**: Success checkmark replaces icon for 2 seconds

**Micro-interactions:**
- Button hover: Scale 1.02, transition 150ms
- Card hover: Lift 2px, deeper shadow, transition 200ms
- Input focus: Blue glow, transition 150ms

**Accessibility:**
- Respect prefers-reduced-motion
- Provide settings toggle to disable animations

---

## Detailed Functional Requirements & Behavior

### Phase 1: Input & Ingestion
**Goal**: Frictionless entry with robust error recovery and multiple input methods

#### File Upload Component

**Behavior:**
- Drag-and-drop zone with dashed border
- "Browse Files" button as alternative
- Accepts: `.pdf`, `.docx`, `.txt`
- File size limit: 10MB (validate client-side)

**Upload Flow:**
```
1. User drops/selects file
2. Show "Parsing..." spinner immediately
3. Send to /api/upload/parse
4. Server extracts text using:
   - pdf-parse for PDF
   - mammoth for DOCX
   - fs.readFile for TXT
5. Success:
   → Display preview (first 500 characters)
   → Show file name and size
   → Store full text in Zustand
6. Failure (encrypted/corrupted):
   → Toast: "Could not read file. Please paste text."
   → Automatically expand "Paste Text" textarea
   → User pastes manually
   → Continue normally
```

**Error States:**
- Invalid file type: "Please upload PDF, DOCX, or TXT"
- File too large: "File must be under 10MB"
- Parse error: "Could not read file. Please paste text."

**UI Elements:**
- Dropzone: Dashed border (Electric Blue on hover)
- File preview card: Shows name, size, preview text
- Remove button: X icon (hover: Error Red)

---

#### Job URL Fetching Component

**Behavior:**
- Single text input for URL
- "Fetch" button triggers server-side proxy
- REACTIVE textarea for both fetched and manual content
- No duplicate inputs (one textarea for all job description input)

**Fetch Flow:**
```
1. User pastes URL into input field
2. User clicks "Fetch Job Description" button
3. Frontend shows loading spinner
4. POST to /api/job/fetch with URL
5. Server attempts fetch:
   try {
     const response = await fetch(url, {
       headers: { 'User-Agent': 'Mozilla/5.0...' }
     });
     const html = await response.text();
     const text = extractTextFromHTML(html); // Strip HTML tags
     return { success: true, text };
   } catch (error) {
     if (error.status === 403 || error.status === 401) {
       return { success: false, blocked: true };
     }
     return { success: false, error: error.message };
   }
6. Success:
   → Populate textarea with fetched text
   → User can edit if needed
   → Continue normally
7. Blocked (403/401/Cloudflare):
   → Show modal:
      Title: "Access Denied"
      Message: "This site blocks automated reading. Please copy-paste the job description manually."
      Button: "Copy-Paste Instead" (closes modal)
   → User pastes into same textarea
   → Continue normally
8. Other Error:
   → Toast: "Could not fetch. Please paste manually."
   → Focus textarea
```

**Edge Cases:**
- **Cloudflare Challenge**: Modal with friendly message
- **LinkedIn/Indeed**: Known to block, graceful fallback
- **Invalid URL**: Validate URL format before sending
- **Timeout**: 10 second timeout, then fallback

**UI Elements:**
- URL input: Full width, placeholder: "Paste job posting URL (e.g., LinkedIn, Indeed)"
- Fetch button: Electric Blue, shows spinner when loading
- Single textarea: For both fetched and manual input
- Modal: Glassmorphism overlay with clear messaging

---

#### Validation Rules

**Resume:**
- Minimum length: 50 words
- Real-time character/word count displayed
- Warning if below minimum: "Resume too short (X/50 words)"

**Job Description:**
- Minimum length: 50 words
- Real-time character/word count displayed
- Warning if below minimum: "Job description too short (X/50 words)"

**Next Button State:**
- Disabled (gray) until both validated
- Enabled (Electric Blue) when ready
- Hover tooltip if disabled: "Please complete both fields"

---

### Phase 2: AI Analysis (Deep Semantic Analysis)
**Goal**: Beyond keyword matching - understand context and authenticity potential

#### Keyword Gap Analysis Logic

**Extraction Phase:**
```
1. Parse Job Description:
   - Extract hard skills (Tools, Languages, Frameworks)
     Examples: Python, AWS, Kubernetes, Terraform
   - Extract soft skills (Methodologies, Leadership)
     Examples: Agile, Scrum, Team Leadership, Stakeholder Management
   - Count frequency of each keyword
   
2. Parse Resume:
   - Scan full text for same keywords
   - Note location (Skills section vs. Experience bullets)
   - Count occurrences
```

**Categorization Algorithm:**
```typescript
interface KeywordAnalysis {
  keyword: string;
  jdFrequency: number;
  resumeFrequency: number;
  resumeLocations: ('skills' | 'experience' | 'summary')[];
  category: 'critical_missing' | 'underweighted' | 'optimized';
  tier: 1 | 2 | 3; // Priority tier
}

function categorizeKeyword(kw: KeywordAnalysis): Category {
  if (kw.jdFrequency >= 3 && kw.resumeFrequency === 0) {
    return 'critical_missing'; // RED
  }
  
  if (kw.jdFrequency >= 3 && 
      (kw.resumeFrequency === 1 || 
       kw.resumeLocations.includes('skills') && !kw.resumeLocations.includes('experience'))) {
    return 'underweighted'; // YELLOW
  }
  
  return 'optimized'; // GREEN
}

function assignTier(kw: KeywordAnalysis, roleContext: RoleContext): Tier {
  // Tier 1: Critical for this specific role
  if (kw.jdFrequency >= 5 && canAuthenticAdd(kw, roleContext)) {
    return 1;
  }
  
  // Tier 2: High value, good fit
  if (kw.jdFrequency >= 3 && canAuthenticAdd(kw, roleContext)) {
    return 2;
  }
  
  // Tier 3: Nice to have
  return 3;
}
```

**Authenticity Check:**
```
Claude must verify context before suggesting additions:

BAD Example:
- Keyword: "Python"
- Role: "Customer Service Representative"
- Analysis: REJECT - Not authentic for this role

GOOD Example:
- Keyword: "Python"
- Role: "QA Automation Engineer"
- Context: Resume mentions "automation scripts"
- Analysis: POTENTIAL - Ask via clarifying question
```

**Display Format:**
```
CRITICAL MISSING (Red badges)
- AWS (appears 5x in JD, 0x in resume)
- Kubernetes (appears 4x in JD, 0x in resume)

UNDERWEIGHTED (Yellow badges)
- Python (appears 6x in JD, 1x in resume - only in Skills section)
- Microservices (appears 4x in JD, 1x in resume)

OPTIMIZED (Green badges)
- Docker (appears 3x in JD, 4x in resume - in Experience)
- CI/CD (appears 5x in JD, 6x in resume - throughout)
```

---

### Phase 3: Authenticity Wizard (Clarification Loop)
**Goal**: Verify user actually has experience before suggesting additions

#### Clarifying Questions Agent

**Question Generation Logic:**
```
1. Analyze "Critical Missing" keywords from Phase 2
2. For each keyword, check if user likely has experience:
   - Is related keyword present? (e.g., "Docker" present, "Kubernetes" missing)
   - Is role appropriate? (Tech role vs. Non-tech role)
   - Is company/industry appropriate? (Tech company vs. Non-tech)
3. Generate contextual questions
4. Limit to 3 highest-impact questions
```

**Question Templates:**
```
Template 1 (Technology Adjacency):
"The job requires [MISSING_TECH]. Did you use [MISSING_TECH] in your [RELATED_TECH] projects at [COMPANY]?"

Example:
"The job requires Kubernetes. Did you use K8s in your Docker projects at DocuSign?"

Template 2 (Role Context):
"I see you were [ROLE] at [COMPANY]. Did this involve [MISSING_SKILL]?"

Example:
"I see you were Director of QA at DocuSign. Did this involve governance forums or steering committees?"

Template 3 (Timeframe Context):
"Between [START_DATE] and [END_DATE] at [COMPANY], did you work with [MISSING_TECH]?"

Example:
"Between 2018 and 2024 at DocuSign, did you work with AWS or Azure cloud platforms?"
```

**User Response Options:**
```
For each question:

1. Yes (with details):
   - Textarea appears: "Please provide brief details"
   - User types: "Yes, used K8s for container orchestration in production"
   - This enables Claude to craft authentic bullet

2. No:
   - Keyword marked as "Cannot add authentically"
   - Will not appear in recommendations

3. Skip:
   - Treated same as "No"
   - Allows user to move quickly
```

**UI Format:**
```
Option A (Chat-like):
- Questions appear one at a time
- User responds
- Next question slides in

Option B (Form-like):
- All 3 questions shown at once
- User answers in any order
- Submit button at bottom

Recommendation: Form-like (faster for user)
```

**Fatigue Prevention:**
```
- Maximum 3 questions (enforced in Claude prompt)
- Focus on highest-impact keywords only
- Skip questions that have obvious answers from context
- If Phase 2 has <3 critical missing keywords, ask fewer questions
```

---

### Phase 4: Recommendation Engine (STAR Method)
**Goal**: Present clear, educational suggestions with visual diff

#### Bullet Rewriting Logic

**Input Structure:**
```typescript
interface BulletRewriteInput {
  originalBullet: string;
  role: string;
  company: string;
  dates: string;
  targetKeywords: string[];
  userAnswers: {
    keyword: string;
    hasExperience: boolean;
    details?: string;
  }[];
  context: {
    prevBullets: string[];
    nextBullets: string[];
  };
}
```

**STAR Method Application:**
```
Situation: Context of the work
Task: What needed to be done
Action: What you did (include new keyword here)
Result: Quantified outcome

Example:
Original: "Managed QA team and improved quality processes"

Rewritten (adding "Kubernetes"):
"Led QA team supporting microservices deployed on Kubernetes, implementing automated testing pipelines that reduced defect escape rate by 40%"

Breakdown:
- Situation: QA team, microservices environment
- Task: Testing in Kubernetes environment
- Action: Implemented automated pipelines (keyword: Kubernetes)
- Result: 40% reduction in defect escape rate
```

**Constraints:**
```
- Maximum 2 lines per bullet (standard resume format)
- Preserve ALL existing metrics
- Add keywords naturally (not forced)
- Match original writing style (achievement-focused, metrics-driven)
- Never fabricate experience
```

**Claude Prompt Engineering:**
```
System Prompt (excerpt):
"You are rewriting a resume bullet. 

CRITICAL RULES:
1. Add [KEYWORD] ONLY where it reflects actual work (confirmed by user)
2. Use STAR method: Situation, Task, Action, Result
3. Maximum 2 lines
4. Preserve all existing numbers/percentages
5. Match style: Direct, achievement-focused, active voice

Original: [BULLET]
Context: [USER_ANSWER_DETAILS]
Keyword to add: [KEYWORD]

Output format:
Rewritten: [NEW_BULLET]
Rationale: [WHY this works and is authentic]
"
```

---

#### Diff Viewer UI

**Visual Design:**
```
┌─────────────────────────────────────────────────────────────┐
│ EDIT #1 - DocuSign, Sr. Manager (Sep 2018 - Dec 2024)     │
│                                                             │
│ Current:                                                    │
│ Led QA team and implemented automated testing pipelines.   │
│                                                             │
│ Suggested:                                                  │
│ Led QA team supporting microservices on Kubernetes,        │
│ implementing automated testing pipelines that reduced       │
│ defect escape rate by 40%.                                  │
│                                                             │
│ Changes:                                                    │
│ • Added: "Kubernetes" (appears 5x in job description)      │
│ • Added: "microservices" (appears 4x in job description)   │
│ • Clarified: Scope of pipelines                            │
│                                                             │
│ Rationale:                                                  │
│ Based on your confirmation that you worked with K8s at     │
│ DocuSign. This positions your QA work in modern cloud      │
│ infrastructure context.                                     │
│                                                             │
│ [Approve]  [Edit Before Approving]  [Reject]              │
└─────────────────────────────────────────────────────────────┘
```

**Color Coding:**
```css
.diff-added {
  color: #10B981; /* Success Green */
  font-weight: 600;
  background: rgba(16, 185, 129, 0.1);
  padding: 0 4px;
  border-radius: 3px;
}

.diff-removed {
  color: #EF4444; /* Error Red */
  text-decoration: line-through;
  opacity: 0.6;
}

.diff-keyword {
  color: #38BDF8; /* Electric Blue */
  font-weight: 700;
  cursor: help; /* Shows tooltip on hover */
}
```

**Interactive Tooltips:**
```typescript
<Tooltip content="Added because 'Kubernetes' appears 5x in job description">
  <span className="diff-keyword">Kubernetes</span>
</Tooltip>
```

**Side-by-Side View:**
```
┌─────────────────────┬─────────────────────┐
│ CURRENT             │ SUGGESTED           │
├─────────────────────┼─────────────────────┤
│ Led QA team and     │ Led QA team         │
│ implemented         │ supporting          │
│ automated testing   │ microservices on    │
│ pipelines.          │ Kubernetes,         │
│                     │ implementing        │
│                     │ automated testing   │
│                     │ pipelines that      │
│                     │ reduced defect      │
│                     │ escape rate by 40%. │
└─────────────────────┴─────────────────────┘
```

---

#### Approval Workflow

**Interaction Options:**

1. **Approve** (Green button):
   - Immediately accepts suggestion
   - Checkmark animation
   - Move to next edit

2. **Edit Before Approving** (Blue button):
   - Inline textarea appears with suggested text
   - User can modify wording
   - "Save Edit" button commits changes
   - Useful for tweaking phrasing while keeping keyword

3. **Reject** (Red button):
   - Dismisses suggestion
   - Original bullet unchanged
   - Move to next edit

4. **Approve All** (Floating action button):
   - Quick approval for confident users
   - Shows count: "Approve All (15)"
   - Confirmation modal: "Are you sure you want to approve all 15 suggestions?"
   - Success animation: Confetti explosion

**Bulk Actions:**
```
- Approve All in This Role
- Reject All in This Role
- Reset All Selections
```

**Progress Tracking:**
```
Top of screen:
"Reviewed: 8/15 suggestions"

Progress bar: Visual indicator of completion
```

---

### Phase 5: Export & Delivery
**Goal**: Professional, ATS-compatible output

#### Workday-Ready Formatting

**Critical Requirements:**
```
- Use hyphen with space (- ) for bullets
- NOT bullet points (•) - Workday strips these
- Plain text, no special formatting
- Ready to paste directly into Workday text fields
```

**Output Structure:**
```
═══════════════════════════════════
DOCUSIGN
Sr. Manager of Software Engineering | Chicago, IL | Sep 2018 - Dec 2024
═══════════════════════════════════

- Led comprehensive software engineering functions including QA, Release Management, and Technical Program Management, supporting microservices architecture on Kubernetes infrastructure.

- Advanced quality engineering practices and developer enablement, implementing test infrastructure and automated quality gates that improved developer productivity by 35%.

[... all bullets ...]

KEYWORD COVERAGE: Kubernetes, Microservices, DevOps, CI/CD, Cloud Infrastructure
```

**Copy Button Behavior:**
```
1. User clicks "Copy" button for a role section
2. Text copied to clipboard
3. Button shows checkmark with "Copied!" text for 2 seconds
4. Button returns to normal state
5. Framer Motion: Scale bounce animation on copy
```

---

#### Word Document Generation

**ATS Compatibility Requirements:**
```
CRITICAL for ATS parsing:
- Fonts: Arial or Calibri ONLY
- No tables (ATS can't parse)
- No columns (ATS reads left-to-right)
- No graphics/images
- No text boxes
- No headers/footers with critical info
- Clear section headers
- Consistent formatting
```

**Document Structure:**
```
┌─────────────────────────────────────────────┐
│ KONSTANTIN 'KEN' POMERANETS                 │
│ (847) 401-0780 | ken.pomeranets@gmail.com  │
│ Chicago, IL | linkedin.com/in/kenpomeranets│
├─────────────────────────────────────────────┤
│                                             │
│ PROFESSIONAL EXPERIENCE                     │
│                                             │
│ Sr. Manager of Software Engineering         │
│ DocuSign | Chicago, IL | Sep 2018 - Dec 2024│
│                                             │
│ • [Optimized bullet 1]                      │
│ • [Optimized bullet 2]                      │
│ • [...]                                     │
│                                             │
│ [Next role...]                              │
│                                             │
├─────────────────────────────────────────────┤
│ TECHNICAL SKILLS                            │
│                                             │
│ [Updated skills list including new keywords]│
└─────────────────────────────────────────────┘
```

**File Naming Convention:**
```
Format: [Role]_[Company]_[YYYY-MM-DD].docx

Examples:
- Executive_Director_SDET_OCC_2024-12-17.docx
- VP_Quality_Engineering_Acme_Corp_2024-12-20.docx

Parsing logic:
- Extract role from job description (if provided)
- Extract company from job description (if provided)
- Use today's date
- Sanitize special characters
- Replace spaces with underscores
```

**Metadata Form:**
```
Before generating document, collect:
- Company Name (pre-filled if detected)
- Position Title (pre-filled if detected)  
- Salary Range (or "Not specified")
- Job Posting URL

This appears in document footer for reference
```

---

## Use Cases & User Stories

### Use Case A: "The Technical Pivot"

**Scenario**: Java Developer applying for Python role

**User**: Senior Java Developer with 8 years experience  
**Goal**: Transition to Python-focused role  
**Challenge**: Resume heavily weighted toward Java keywords

**Application Flow:**

```
Phase 1: Input
- User uploads Java-heavy resume
- Pastes Python job description
- Next

Phase 2: Analysis
- App identifies:
  CRITICAL MISSING: Python (8x in JD, 0x in resume)
  CRITICAL MISSING: Django (4x in JD, 0x in resume)
  UNDERWEIGHTED: APIs (10x in JD, 2x in resume)

Phase 3: Questions
Q1: "The job requires Python. Have you used Python in side projects or scripting at any of your roles?"
User: "Yes, wrote Python scripts for CI/CD automation at current company"

Q2: "Have you worked with Django or similar web frameworks?"
User: "No"

Q3: "The job emphasizes API development. Can you describe your API work?"
User: "Built RESTful APIs in Java, led API design for 3 microservices"

Phase 4: Recommendations
EDIT #1:
Current: "Led development of microservices architecture"
Suggested: "Led development of microservices architecture with RESTful APIs, automated CI/CD pipelines using Python scripts, reducing deployment time by 40%"
Changes: +Python, +APIs, +RESTful APIs
Rationale: Authentic based on Q1 and Q3 answers

EDIT #2:
Current: "Implemented automated testing frameworks"
Suggested: [Keeps as-is, no Django added since user said no]

User approves EDIT #1, completes other edits

Phase 5: Export
- Document now shows Python experience authentically
- APIs mentioned multiple times in context
- User pastes into Workday, applies for role
```

**Outcome**: Resume now shows Python + API experience without fabrication. User has genuine talking points for interview.

---

### Use Case B: "The Blocked URL"

**Scenario**: User tries to fetch LinkedIn job posting

**User**: QA Manager applying to LinkedIn role  
**Challenge**: LinkedIn blocks automated scraping

**Application Flow:**

```
Phase 1: Input
- User uploads resume
- Pastes LinkedIn job URL: https://www.linkedin.com/jobs/view/1234567
- Clicks "Fetch Job Description"

Server-Side Attempt:
- Server sends GET request to LinkedIn
- LinkedIn returns 403 Forbidden
- Detects Cloudflare challenge page

Graceful Recovery:
- Modal appears:
  ┌──────────────────────────────────────┐
  │ ⚠️  Access Denied                    │
  │                                      │
  │ LinkedIn doesn't allow direct       │
  │ access. Please copy the job         │
  │ description text and paste it here. │
  │                                      │
  │           [Copy-Paste Instead]      │
  └──────────────────────────────────────┘

- User clicks button
- Modal closes
- Focus shifts to job description textarea
- User manually pastes job description from LinkedIn
- Flow continues normally

Phase 2-5: Proceed as usual
```

**Outcome**: App didn't crash or confuse user. Clear messaging and fallback path. User continues workflow seamlessly.

---

### Use Case C: "The Encrypted PDF"

**Scenario**: User uploads password-protected resume PDF

**User**: Executive with confidential resume  
**Challenge**: PDF is encrypted

**Application Flow:**

```
Phase 1: Input
- User drags encrypted PDF to dropzone
- "Parsing..." spinner appears
- Server attempts to parse with pdf-parse

Server-Side:
- pdf-parse throws error: "Encrypted PDF"
- Catches error, returns: { success: false, reason: 'encrypted' }

Graceful Recovery:
- Toast notification appears (top-right):
  "Could not read file. Please paste resume text below."
- "Paste Text" textarea automatically expands
- Focus shifts to textarea
- User pastes resume text
- Validation checks: >50 words
- "Next" button enables

Phase 2-5: Proceed as usual
```

**Outcome**: User not blocked by technical limitation. Clear path forward. No data lost.

---

## Component Specifications

### Zustand Store Structure

```typescript
// src/store/useResumeStore.ts

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface ResumeStore {
  // Phase 1: Input
  resume: {
    fileName?: string;
    text: string;
    parsed: boolean;
  };
  jobDescription: {
    source: 'url' | 'paste';
    url?: string;
    text: string;
  };
  
  // Wizard State
  currentPhase: 1 | 2 | 3 | 4 | 5;
  
  // Phase 2: Analysis
  analysis: {
    keywordGaps: KeywordGap[];
    roleRelevance: RoleRelevance[];
    isComplete: boolean;
  } | null;
  
  // Phase 3: Questions
  questions: ClarifyingQuestion[];
  answers: QuestionAnswer[];
  
  // Phase 4: Recommendations
  edits: BulletEdit[];
  approvals: ApprovalDecision[];
  
  // Phase 5: Output
  finalOutput: FinalRoleOutput[] | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setResume: (resume: Partial<ResumeStore['resume']>) => void;
  setJobDescription: (jd: Partial<ResumeStore['jobDescription']>) => void;
  nextPhase: () => void;
  prevPhase: () => void;
  setAnalysis: (analysis: ResumeStore['analysis']) => void;
  setQuestions: (questions: ClarifyingQuestion[]) => void;
  addAnswer: (answer: QuestionAnswer) => void;
  setEdits: (edits: BulletEdit[]) => void;
  updateApproval: (editId: string, decision: ApprovalDecision) => void;
  setFinalOutput: (output: FinalRoleOutput[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        resume: { text: '', parsed: false },
        jobDescription: { source: 'paste', text: '' },
        currentPhase: 1,
        analysis: null,
        questions: [],
        answers: [],
        edits: [],
        approvals: [],
        finalOutput: null,
        isLoading: false,
        error: null,
        
        // Actions
        setResume: (resume) => set((state) => ({
          resume: { ...state.resume, ...resume }
        })),
        
        setJobDescription: (jd) => set((state) => ({
          jobDescription: { ...state.jobDescription, ...jd }
        })),
        
        nextPhase: () => set((state) => ({
          currentPhase: Math.min(state.currentPhase + 1, 5) as 1 | 2 | 3 | 4 | 5
        })),
        
        prevPhase: () => set((state) => ({
          currentPhase: Math.max(state.currentPhase - 1, 1) as 1 | 2 | 3 | 4 | 5
        })),
        
        setAnalysis: (analysis) => set({ analysis }),
        setQuestions: (questions) => set({ questions }),
        addAnswer: (answer) => set((state) => ({
          answers: [...state.answers, answer]
        })),
        setEdits: (edits) => set({ edits }),
        updateApproval: (editId, decision) => set((state) => ({
          approvals: [...state.approvals.filter(a => a.editId !== editId), decision]
        })),
        setFinalOutput: (output) => set({ finalOutput: output }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        reset: () => set({
          resume: { text: '', parsed: false },
          jobDescription: { source: 'paste', text: '' },
          currentPhase: 1,
          analysis: null,
          questions: [],
          answers: [],
          edits: [],
          approvals: [],
          finalOutput: null,
          isLoading: false,
          error: null
        })
      }),
      {
        name: 'resume-optimizer-storage',
        version: 1
      }
    )
  )
);
```

---

### Phase 1 Components

#### `<FileUploadZone />`

**Props**: None (uses Zustand store)

**Behavior**:
- react-dropzone for drag-and-drop
- Validates file type and size
- Sends to /api/upload/parse
- On success: Updates store with text
- On failure: Shows toast, expands paste area

**UI States**:
```typescript
type UploadState = 
  | 'idle'      // Waiting for file
  | 'dragover'  // User dragging file over zone
  | 'uploading' // Sending to server
  | 'parsing'   // Server extracting text
  | 'success'   // Text extracted
  | 'error';    // Failed to parse
```

**Implementation Outline**:
```typescript
import { useDropzone } from 'react-dropzone';
import { useResumeStore } from '@/store/useResumeStore';

export function FileUploadZone() {
  const { setResume, setLoading, setError } = useResumeStore();
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  
  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    setUploadState('uploading');
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload/parse', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResume({ text: data.text, fileName: file.name, parsed: true });
        setUploadState('success');
      } else {
        throw new Error(data.error || 'Parse failed');
      }
    } catch (error) {
      setUploadState('error');
      setError('Could not read file. Please paste text.');
      // Auto-expand paste textarea
    } finally {
      setLoading(false);
    }
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });
  
  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      {/* UI based on uploadState */}
    </div>
  );
}
```

---

#### `<JobURLFetcher />`

**Props**: None (uses Zustand store)

**Behavior**:
- Text input for URL
- Fetch button triggers /api/job/fetch
- On success: Populates textarea
- On 403/401: Shows modal with fallback instructions
- Single reactive textarea for all job description input

**Implementation Outline**:
```typescript
export function JobURLFetcher() {
  const { setJobDescription, setLoading } = useResumeStore();
  const [url, setUrl] = useState('');
  const [fetchState, setFetchState] = useState<'idle' | 'fetching' | 'success' | 'blocked' | 'error'>('idle');
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  
  const handleFetch = async () => {
    if (!isValidURL(url)) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    setFetchState('fetching');
    setLoading(true);
    
    try {
      const response = await fetch('/api/job/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setJobDescription({ source: 'url', url, text: data.text });
        setFetchState('success');
        toast.success('Job description fetched!');
      } else if (data.blocked) {
        setFetchState('blocked');
        setShowBlockedModal(true);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setFetchState('error');
      toast.error('Could not fetch. Please paste manually.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <div className="url-fetcher">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste job posting URL (e.g., LinkedIn, Indeed)"
        />
        <button onClick={handleFetch} disabled={!url || fetchState === 'fetching'}>
          {fetchState === 'fetching' ? 'Fetching...' : 'Fetch Job Description'}
        </button>
      </div>
      
      <textarea
        value={jobDescription.text}
        onChange={(e) => setJobDescription({ text: e.target.value })}
        placeholder="Or paste job description here..."
        rows={15}
      />
      
      {/* Blocked Modal */}
      <AccessDeniedModal
        isOpen={showBlockedModal}
        onClose={() => setShowBlockedModal(false)}
      />
    </>
  );
}
```

---

## API Route Specifications

### `/api/upload/parse` - File Parsing

**Method**: POST  
**Content-Type**: multipart/form-data

**Request**:
```typescript
FormData {
  file: File; // PDF, DOCX, or TXT
}
```

**Response**:
```typescript
// Success
{
  success: true;
  text: string; // Extracted text
  fileName: string;
}

// Failure
{
  success: false;
  error: string; // "encrypted" | "corrupted" | "unsupported"
}
```

**Implementation**:
```typescript
// src/app/api/upload/parse/route.ts

import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }
    
    const buffer = await file.arrayBuffer();
    const fileName = file.name;
    const fileExt = fileName.split('.').pop()?.toLowerCase();
    
    let text = '';
    
    if (fileExt === 'pdf') {
      try {
        const data = await pdfParse(Buffer.from(buffer));
        text = data.text;
      } catch (error) {
        if (error.message.includes('encrypted')) {
          return NextResponse.json({ success: false, error: 'encrypted' });
        }
        throw error;
      }
    } else if (fileExt === 'docx') {
      const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
      text = result.value;
    } else if (fileExt === 'txt') {
      text = Buffer.from(buffer).toString('utf-8');
    } else {
      return NextResponse.json({ success: false, error: 'unsupported' });
    }
    
    // Basic validation
    if (text.length < 50) {
      return NextResponse.json({ success: false, error: 'Content too short' });
    }
    
    return NextResponse.json({ success: true, text, fileName });
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json({ success: false, error: 'Parse failed' }, { status: 500 });
  }
}
```

---

### `/api/job/fetch` - URL Fetching

**Method**: POST  
**Content-Type**: application/json

**Request**:
```typescript
{
  url: string; // Job posting URL
}
```

**Response**:
```typescript
// Success
{
  success: true;
  text: string; // Extracted job description
  url: string;
}

// Blocked (403/401/Cloudflare)
{
  success: false;
  blocked: true;
  message: string;
}

// Other Error
{
  success: false;
  error: string;
}
```

**Implementation**:
```typescript
// src/app/api/job/fetch/route.ts

import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url || !isValidURL(url)) {
      return NextResponse.json({ success: false, error: 'Invalid URL' }, { status: 400 });
    }
    
    // Server-side fetch with User-Agent to avoid basic blocks
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    // Check for blocks
    if (response.status === 403 || response.status === 401) {
      return NextResponse.json({
        success: false,
        blocked: true,
        message: 'This site blocks automated access'
      });
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const html = await response.text();
    
    // Detect Cloudflare challenge
    if (html.includes('cf-browser-verification') || html.includes('ray ID')) {
      return NextResponse.json({
        success: false,
        blocked: true,
        message: 'Cloudflare protection detected'
      });
    }
    
    // Extract text from HTML
    const $ = cheerio.load(html);
    
    // Remove script and style tags
    $('script, style, nav, header, footer').remove();
    
    // Get text content
    const text = $('body').text()
      .replace(/\s+/g, ' ') // Collapse whitespace
      .trim();
    
    if (text.length < 100) {
      return NextResponse.json({
        success: false,
        error: 'Could not extract meaningful content'
      });
    }
    
    return NextResponse.json({ success: true, text, url });
    
  } catch (error) {
    if (error.name === 'AbortError') {
      return NextResponse.json({
        success: false,
        error: 'Request timeout'
      });
    }
    
    console.error('Fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch URL'
    }, { status: 500 });
  }
}

function isValidURL(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}
```

---

### `/api/claude/analyze` - Phase 2 Analysis

**Method**: POST  
**Content-Type**: application/json

**Request**:
```typescript
{
  resume: string;
  jobDescription: string;
  jobalyticsKeywords?: string[]; // Optional external keywords
}
```

**Response**:
```typescript
{
  analysis: {
    keywordGaps: Array<{
      keyword: string;
      category: 'critical_missing' | 'underweighted' | 'optimized';
      tier: 1 | 2 | 3;
      jdFrequency: number;
      resumeFrequency: number;
      resumeLocations: ('skills' | 'experience' | 'summary')[];
    }>;
    roleRelevance: Array<{
      roleName: string;
      company: string;
      dates: string;
      fitScore: number; // 0-10
      potentialKeywords: string[];
      notes: string;
    }>;
    summary: {
      totalKeywords: number;
      criticalMissing: number;
      underweighted: number;
      optimized: number;
    };
  };
}
```

**Implementation** (uses System Prompt from Appendix A)

---

## Risk Register

### Risk 001 - Developer Experience Level
**Severity**: HIGH  
**Probability**: CERTAIN  
**Description**: Primary developer (Ken) is beginner in React/Next.js/TypeScript  
**Impact**: Slower development, potential bugs, may need help  
**Mitigation**:
- Extensive inline code comments
- Use AI assistance (Claude, ChatGPT)
- Comprehensive documentation in prompt.md
- Build incrementally with testing at each step
- Accept longer timeline
**Status**: ACCEPTED - Mitigations in place

---

### Risk 002 - No API Key Yet
**Severity**: HIGH  
**Probability**: RESOLVED (once key obtained)  
**Description**: Cannot test Claude integration without API key  
**Impact**: Blocked on core functionality  
**Mitigation**:
- Get API key immediately (today)
- Design API abstraction layer
- Can build UI while waiting
- Mock responses for UI testing
**Status**: ACTIVE - Waiting on key acquisition

---

### Risk 003 - API Cost Overruns
**Severity**: MEDIUM  
**Probability**: LOW  
**Description**: Claude API calls could become expensive with heavy use  
**Impact**: ~$3-15 per application (acceptable), but could spike  
**Mitigation**:
- Monitor usage in Anthropic console
- Set usage alerts
- Implement caching for repeated prompts
- Use smaller models for simple tasks (future optimization)
**Status**: MONITORING

---

### Risk 004 - Workday Compatibility
**Severity**: MEDIUM  
**Probability**: MEDIUM  
**Description**: Workday text fields might not accept hyphen formatting or have length limits  
**Impact**: Output might not paste correctly  
**Mitigation**:
- Test with real Workday application early (OCC application)
- Document any issues found
- Have fallback formatting options
- Provide copy button with success feedback
**Status**: NEEDS TESTING

---

### Risk 005 - Resume Parsing Accuracy
**Severity**: MEDIUM  
**Probability**: MEDIUM  
**Description**: PDF/DOCX parsing might not extract text correctly (formatting issues, multi-column layouts)  
**Impact**: Analysis based on incomplete resume data  
**Mitigation**:
- Show parsed text preview to user
- Allow manual correction
- Support multiple formats (PDF, DOCX, TXT)
- Validate minimum content length
- Graceful fallback to manual paste
**Status**: MITIGATED

---

### Risk 006 - Claude API Rate Limits
**Severity**: LOW  
**Probability**: LOW  
**Description**: Heavy usage could hit API rate limits  
**Impact**: Temporary service interruption  
**Mitigation**:
- Implement retry logic with exponential backoff
- Show user-friendly error messages
- Cache responses where appropriate
**Status**: MONITORING

---

### Risk 007 - Fabricated Experience
**Severity**: CRITICAL  
**Probability**: LOW (with mitigations)  
**Description**: AI might suggest experience user doesn't have  
**Impact**: Ethical violation, could harm job search  
**Mitigation**:
- **CRITICAL**: Clarifying questions phase (Phase 2A)
- User reviews all suggestions before approval
- Rationale shown for every edit
- User can reject any suggestion
- Emphasis in prompt: "Never fabricate experience"
**Status**: MITIGATED - Core design principle

---

### Risk 008 - Long Context Window Issues
**Severity**: MEDIUM  
**Probability**: LOW  
**Description**: Very long resumes + job descriptions might exceed context window  
**Impact**: API call fails or truncates content  
**Mitigation**:
- Claude Sonnet has 200K context window (very large)
- Validate input lengths before sending
- Truncate with warning if needed
- Use prompt caching for repeated content (future optimization)
**Status**: MONITORING

---

### Risk 009 - URL Fetching Blocks
**Severity**: MEDIUM  
**Probability**: HIGH  
**Description**: Many job sites (LinkedIn, Indeed) actively block automated scraping  
**Impact**: URL fetching feature fails frequently  
**Mitigation**:
- Graceful fallback with clear modal messaging
- User can always paste manually
- Don't position URL fetching as primary feature
- Consider rotating User-Agents (careful with ToS)
- Accept that this feature will fail ~50% of the time
**Status**: ACCEPTED - Designed for graceful degradation

---

### Risk 010 - Zustand Learning Curve
**Severity**: LOW  
**Probability**: MEDIUM  
**Description**: Team (Ken) unfamiliar with Zustand  
**Impact**: Slower initial development, potential state bugs  
**Mitigation**:
- Zustand has minimal API surface (easier than Redux)
- Comprehensive inline comments in store definition
- Example patterns in this prompt
- AI assistance can help with Zustand patterns
**Status**: ACCEPTED - Benefits outweigh learning investment

---

### Risk 011 - Framer Motion Performance
**Severity**: LOW  
**Probability**: LOW  
**Description**: Complex animations might slow on lower-end devices  
**Impact**: Poor UX for some users  
**Mitigation**:
- Use prefers-reduced-motion CSS
- Provide settings toggle to disable animations
- Keep animations simple and performant
- Test on lower-end devices
**Status**: MONITORING

---

### Risk 012 - No Streaming Responses
**Severity**: LOW  
**Probability**: CERTAIN  
**Description**: Anthropic SDK doesn't have built-in streaming like Vercel AI SDK  
**Impact**: Longer perceived wait times for analysis/recommendations  
**Mitigation**:
- Show engaging loading states (progress indicators, status messages)
- Can implement SSE streaming manually if needed
- Claude responses are fast enough that streaming may not be critical
- Focus Phase 1 on non-streaming, add streaming later if needed
**Status**: ACCEPTED - Can add streaming later if UX demands it

---

## Design Decisions Log

### [Decision 001] - Use Next.js Over Streamlit
**Date**: December 17, 2024  
**Context**: Needed to choose MVP framework  
**Alternatives Considered**:
- Python/Streamlit (faster to build, Python-native)
- Vanilla React + Express (more setup required)
- Next.js (steeper learning curve but better long-term)

**Decision**: Next.js + TypeScript  
**Rationale**:
- Better productization path
- Professional UI capabilities
- Type safety reduces bugs
- Easy Vercel deployment
- Can scale to SaaS if needed

**Tradeoffs Accepted**:
- Steeper learning curve for beginner
- More initial setup time
- More complex than Streamlit

**Outcome**: Accepted tradeoff for long-term benefits

---

### [Decision 002] - Prompt-Driven Development
**Date**: December 17, 2024  
**Context**: How to manage project complexity for beginner developer  
**Alternatives Considered**:
- Traditional code-first development
- Minimal documentation
- External project management tool

**Decision**: Comprehensive prompt.md as source of truth  
**Rationale**:
- Enables AI assistance at any time
- Documents all decisions and context
- Can hand off to developer/AI seamlessly
- Version controlled with code
- Forces thoughtful design

**Tradeoffs Accepted**:
- Extra time documenting upfront
- Discipline required to keep updated

**Outcome**: Investing time now saves time later

---

### [Decision 003] - Hyphen Formatting for Bullets
**Date**: December 17, 2024  
**Context**: Workday text fields strip bullet points (•)  
**Alternatives Considered**:
- Use bullet points and hope it works
- No bullets (hard to read)
- Numbers (wrong semantically)

**Decision**: Use "- " (hyphen with space) for all bullets  
**Rationale**:
- Pastes correctly into Workday
- Visually acceptable
- Markdown-compatible
- Easy to search/replace if needed

**Tradeoffs Accepted**:
- Less visually appealing than bullets
- User might need to be educated on this

**Outcome**: Practical solution that works

---

### [Decision 004] - All 5 Phases in One App
**Date**: December 17, 2024  
**Context**: Could build Phase 1 only or all phases  
**Alternatives Considered**:
- Phase 1 MVP, then iterate
- Build all 5 phases at once
- Separate apps per phase

**Decision**: Design all 5 phases, build incrementally  
**Rationale**:
- Ensures coherent architecture
- Can prioritize Phase 1 implementation
- Avoids rework later
- User can see roadmap

**Tradeoffs Accepted**:
- More upfront planning
- Longer time to "complete" app

**Outcome**: Build foundation correctly first time

---

### [Decision 005] - Client-Side State vs. Server-Side Persistence
**Date**: December 17, 2024  
**Context**: Where to store application state  
**Alternatives Considered**:
- Full database (PostgreSQL, MongoDB)
- localStorage only
- Session storage
- No persistence (start over each time)

**Decision**: Zustand + localStorage persistence, add database later if needed  
**Rationale**:
- Simpler MVP
- No database setup required
- localStorage sufficient for single-user
- Zustand provides structured state management
- Can migrate to DB later if multi-user needed

**Tradeoffs Accepted**:
- Data lost if localStorage cleared
- No cross-device sync
- Not suitable for multi-user (future feature)

**Outcome**: Appropriate for MVP, revisit if needed

---

### [Decision 006] - Anthropic Claude Over OpenAI/Gemini
**Date**: December 17, 2024  
**Context**: Needed AI provider for resume optimization  
**Alternatives Considered**:
- OpenAI GPT-4 (streaming via Vercel AI SDK, more established)
- Google Gemini (newer, cheaper)
- Anthropic Claude (best reasoning, 200K context)

**Decision**: Anthropic Claude via Direct SDK  
**Rationale**:
- Best reasoning capabilities for structured tasks
- 200K context window handles long resumes + JDs easily
- Prefer Anthropic's approach to AI safety
- Ken's preference based on experience
- Direct SDK gives more control

**Tradeoffs Accepted**:
- No native streaming (can implement SSE manually if needed)
- Slightly more expensive than Gemini
- Less ecosystem tooling than OpenAI

**Outcome**: Prioritized quality of reasoning over other factors

---

### [Decision 007] - Zustand for State Management
**Date**: December 17, 2024  
**Context**: Needed state management for complex wizard  
**Alternatives Considered**:
- React Context (built-in, simpler)
- Redux (more established, more complex)
- Zustand (middle ground)

**Decision**: Zustand  
**Rationale**:
- Perfect for complex wizard state
- Cleaner API than Context for this use case
- Simpler than Redux
- Built-in devtools support
- Easy persistence with middleware

**Tradeoffs Accepted**:
- Additional dependency
- Learning curve (minimal)

**Outcome**: Best balance of simplicity and power

---

### [Decision 008] - Include Job URL Fetching
**Date**: December 17, 2024  
**Context**: Whether to include server-side URL fetching in MVP  
**Alternatives Considered**:
- Manual copy-paste only (simpler)
- Browser extension for scraping (complex)
- Server-side proxy (middle ground)

**Decision**: Include server-side URL fetching with graceful fallback  
**Rationale**:
- Significant UX improvement over manual copy-paste
- Differentiates from competitors
- Can handle failures gracefully
- Users expect this feature

**Risks Accepted**:
- Sites may block (LinkedIn, Indeed)
- Adds complexity to MVP
- May fail ~50% of the time

**Mitigation**:
- Clear fallback messaging
- Modal explains why it failed
- Always allow manual paste
- Don't position as primary feature

**Outcome**: UX benefit worth the complexity

---

### [Decision 009] - "Cyber-Professional" Design System
**Date**: December 17, 2024  
**Context**: Need to define visual identity  
**Alternatives Considered**:
- Generic professional (boring but safe)
- Material Design (common, recognizable)
- Custom "Cyber-Professional" (unique, memorable)

**Decision**: "Cyber-Professional" dark mode with specific palette  
**Rationale**:
- Appeals to tech professionals (target market)
- Differentiates from generic resume tools
- Modern, sleek aesthetic inspires confidence
- Dark mode reduces eye strain for long sessions
- Ken's preference based on original vision

**Colors Chosen**:
- Background: Deep Navy (#0F172A)
- Primary: Electric Blue (#38BDF8)
- Secondary: Muted Slate (#94A3B8)

**Tradeoffs Accepted**:
- May not appeal to all users (some prefer light mode)
- More design work than using existing system
- Need to maintain consistency

**Outcome**: Strong brand identity worth the effort

---

### [Decision 010] - Framer Motion for Animations
**Date**: December 17, 2024  
**Context**: Need animation library for wizard transitions  
**Alternatives Considered**:
- CSS transitions only (limited)
- React Spring (more complex)
- Framer Motion (best for React)

**Decision**: Framer Motion  
**Rationale**:
- Best React animation library
- Declarative API (easier to learn)
- Great documentation
- Perfect for page transitions
- Built-in AnimatePresence for wizard flow

**Tradeoffs Accepted**:
- Additional bundle size
- Potential performance concerns (mitigated)

**Outcome**: Best tool for smooth, professional animations

---

## Lessons Learned

### [Lesson 001] - Ask About Tools Before Recommending
**Date**: December 17, 2024  
**Context**: Initially recommended Streamlit, but Ken had already started Next.js  
**What Happened**: Didn't ask "what have you already built?" first  
**Learning**: Always assess current state before recommending approach  
**Action**: Now asking about existing code before suggesting alternatives

---

### [Lesson 002] - Beginner Needs Comprehensive Docs
**Date**: December 17, 2024  
**Context**: Ken is beginner in React/TypeScript but building complex app  
**What Happened**: Realized need for extensive documentation and comments  
**Learning**: Don't assume knowledge - document everything  
**Action**: Including extensive comments in code, comprehensive prompt.md

---

### [Lesson 003] - Prompt as Source of Truth is Powerful
**Date**: December 17, 2024  
**Context**: Discussing project management approach  
**What Happened**: Ken suggested prompt.md as single source of truth  
**Learning**: This is actually best practice for AI-assisted development  
**Action**: Adopted comprehensive prompt-driven development

---

### [Lesson 004] - Question Developer Before Deep Dive
**Date**: December 17, 2024  
**Context**: About to write code before confirming priority  
**What Happened**: Realized didn't know Ken's timeline or API key status  
**Learning**: Get basic context before detailed implementation  
**Action**: Asked priority questions before building

---

### [Lesson 005] - Workday Formatting is Critical
**Date**: December 17, 2024  
**Context**: Discovered bullet points (•) don't paste into Workday  
**What Happened**: Had to redesign entire output formatting  
**Learning**: Test actual destination system early  
**Action**: Using hyphen format, will test with OCC application

---

### [Lesson 006] - Merging Vision is Better Than Replacing
**Date**: December 17, 2024  
**Context**: Ken had original prompt with specific technical vision  
**What Happened**: Rather than replace his prompt, merged both approaches  
**Learning**: Best specs combine product vision + comprehensive documentation  
**Action**: This merged prompt keeps Ken's features + my structure

---

## Future Enhancements

### Phase 1.5 - User Accounts (Post-MVP)
**Priority**: MEDIUM  
**Description**: Allow users to create accounts and save their work  
**Benefits**:
- Resume saved for reuse
- History of applications
- Settings persistence
- Multi-device access

**Technical Requirements**:
- Add authentication (NextAuth.js or Clerk)
- Add database (PostgreSQL on Vercel)
- User profile management
- Resume library

**Estimated Effort**: 40-60 hours

---

### Phase 2.5 - Batch Processing (Post-MVP)
**Priority**: LOW  
**Description**: Process multiple job applications at once  
**Benefits**:
- Save time for multiple applications
- Consistent formatting across applications
- Compare keyword matches across jobs

**Technical Requirements**:
- Queue system for multiple jobs
- Batch API calls to Claude
- Progress tracking UI
- Parallel processing

**Estimated Effort**: 20-30 hours

---

### Phase 3.5 - Templates Library
**Priority**: MEDIUM  
**Description**: Save and reuse common edit patterns  
**Benefits**:
- Faster subsequent applications
- Learn from past successful applications
- Industry-specific templates

**Technical Requirements**:
- Template storage
- Template search/filter
- Apply template to new application
- Community template sharing (future)

**Estimated Effort**: 30-40 hours

---

### Phase 4.5 - Enhanced URL Fetching
**Priority**: MEDIUM  
**Description**: Improve URL fetching success rate  
**Benefits**:
- Higher success rate (currently ~50%, target 80%)
- Support more job sites
- Better content extraction

**Technical Requirements**:
- Browser automation (Playwright) for Cloudflare bypass
- Site-specific scrapers (LinkedIn, Indeed, etc.)
- Rotating proxies (careful with ToS)
- Better HTML parsing

**Estimated Effort**: 30-50 hours  
**Risks**: ToS violations, legal concerns

---

### Phase 5.5 - Analytics Dashboard
**Priority**: LOW  
**Description**: Track application success rates, keyword trends  
**Benefits**:
- Learn which optimizations work
- Industry keyword trends
- Personal success metrics

**Technical Requirements**:
- Data collection
- Analytics database
- Visualization components
- Privacy controls

**Estimated Effort**: 40-60 hours

---

### Phase 6 - AI-Powered Cover Letters
**Priority**: HIGH (if productizing)  
**Description**: Generate tailored cover letters based on optimized resume  
**Benefits**:
- Complete application package
- Consistent messaging
- Differentiation from competitors

**Technical Requirements**:
- New Claude prompt for cover letter generation
- Cover letter templates
- Edit and preview interface
- Export to DOCX/PDF

**Estimated Effort**: 60-80 hours

---

### Phase 7 - Multi-User SaaS
**Priority**: LOW (only if monetizing)  
**Description**: Make available to other job seekers  
**Benefits**:
- Revenue potential
- Help others
- Validate product-market fit

**Technical Requirements**:
- Full authentication system
- Payment integration (Stripe)
- User isolation/security
- Subscription management
- Customer support system
- Usage limits and quotas

**Estimated Effort**: 200-300 hours

---

## Troubleshooting Guide

### Common Issues

**Issue**: API key not working  
**Symptoms**: 401 Unauthorized error from Claude API  
**Solution**:
1. Verify `.env.local` has correct key
2. Restart development server (`npm run dev`)
3. Check key hasn't expired in Anthropic console
4. Verify no extra spaces in key

---

**Issue**: Resume not parsing correctly  
**Symptoms**: Blank text or garbled text after upload  
**Solution**:
1. Check file is valid PDF or DOCX
2. Try opening file in reader/Word to verify integrity
3. Try different file format
4. Check for password protection
5. Use fallback: Paste text manually
6. Look for error in browser console

---

**Issue**: Bullets not pasting correctly into Workday  
**Symptoms**: Formatting lost or bullets missing  
**Solution**:
1. Verify text has hyphen-space format (- )
2. Copy from code block in app
3. Paste as plain text in Workday
4. If still failing, note specific Workday version for future fix

---

**Issue**: Claude response seems wrong  
**Symptoms**: Hallucinated experience, inaccurate suggestions  
**Solution**:
1. Check clarifying questions were answered accurately
2. Review rationale for the suggestion
3. REJECT the edit
4. Note the issue for prompt improvement
5. THIS IS WORKING AS DESIGNED - user always has final approval

---

**Issue**: App loading very slowly  
**Symptoms**: Long wait times for API responses  
**Solution**:
1. Check internet connection
2. Check Anthropic status page
3. Large files (resume, job description) increase processing time
4. This is expected - processing can take 30-90 seconds
5. Consider implementing progress indicators with status messages

---

**Issue**: URL fetching always fails  
**Symptoms**: Modal appears for every URL attempt  
**Solution**:
1. Check if site is known to block (LinkedIn, Indeed)
2. Verify URL is valid and accessible
3. Check /api/job/fetch logs for specific error
4. This is expected behavior for some sites
5. Use manual paste fallback (designed for this)

---

**Issue**: TypeScript errors  
**Symptoms**: Red squiggly lines in editor, compilation errors  
**Solution**:
1. Check types are imported correctly
2. Run `npm install` to ensure packages installed
3. Check `tsconfig.json` is not corrupted
4. Restart TypeScript server in editor
5. Check this prompt.md for correct type definitions

---

**Issue**: Zustand state not persisting  
**Symptoms**: Data lost after page refresh  
**Solution**:
1. Check Zustand persist middleware is configured
2. Check browser localStorage (DevTools → Application → Local Storage)
3. Clear localStorage and try again (might be corrupted)
4. Check for localStorage quota exceeded
5. Verify store name matches in persist config

---

**Issue**: Animations not working  
**Symptoms**: No transitions, instant page changes  
**Solution**:
1. Check Framer Motion is installed (`npm install framer-motion`)
2. Check AnimatePresence wraps wizard components
3. Check browser supports animations (not IE11)
4. Check user hasn't enabled prefers-reduced-motion
5. Look for console errors in browser

---

**Issue**: Deployment fails on Vercel  
**Symptoms**: Build errors in Vercel dashboard  
**Solution**:
1. Check environment variables are set in Vercel
2. Verify build succeeds locally (`npm run build`)
3. Check error logs in Vercel dashboard
4. Ensure all dependencies in package.json
5. Verify Node.js version compatibility

---

## Appendix A: Complete System Prompts for Claude API

### Phase 1 - Analysis System Prompt

```
You are an expert ATS (Applicant Tracking System) optimization assistant helping a senior technology leader optimize their resume for Workday job applications.

Your task is to analyze a resume against a job description to identify keyword gaps and opportunities for authentic optimization with SEMANTIC UNDERSTANDING.

CRITICAL RULES:
1. NEVER suggest fabricating experience the candidate doesn't have
2. ONLY suggest adding keywords where they authentically reflect actual work
3. Go beyond simple keyword matching - understand CONTEXT
4. Be specific about which roles can authentically incorporate which keywords
5. Prioritize keywords by ATS impact AND authenticity fit

SEMANTIC ANALYSIS:
- BAD: Adding "Python" to a "Customer Service" role (wrong context)
- GOOD: Suggesting "Python" for "Automation Engineer" who mentions "scripts"
- Check if adjacent skills suggest keyword is plausible (Docker → Kubernetes)

KEYWORD CATEGORIZATION ALGORITHM:
For each keyword in job description:

CRITICAL MISSING (Priority 1):
- Appears ≥3 times in job description
- Appears 0 times in resume
- Is appropriate for candidate's roles/industry
- Mark as Tier 1 if can authentically add

UNDERWEIGHTED (Priority 2):
- Appears ≥3 times in job description
- Appears 1 time in resume OR only in "Skills" section (not in "Experience")
- Needs more prominent positioning
- Mark as Tier 2 if should strengthen

OPTIMIZED (Good):
- Good balance between job description and resume
- Already well-positioned

OUTPUT FORMAT:
Provide your analysis in this structure:

1. KEYWORD GAP ANALYSIS

CRITICAL MISSING:
- [KEYWORD] (appears Nx in JD, 0x in resume) - Tier [1/2/3]
  Context Check: [Can this be added authentically? Why/why not?]

UNDERWEIGHTED:
- [KEYWORD] (appears Nx in JD, 1x in resume - location: [Skills/Experience/Summary])
  Recommendation: [How to strengthen positioning]

OPTIMIZED:
- [KEYWORD] (appears Nx in JD, Mx in resume) - Good balance

2. ROLE-BY-ROLE RELEVANCE

For each role in the resume:
[ROLE NAME] - [COMPANY] ([DATES])
- Fit Score: [0-10] for adding missing keywords
- Can Authentically Add: [list of keywords with brief reasoning]
- Cannot Add: [list with reasoning why not appropriate]
- Notes: [context about this role]

3. PRIORITY RANKING

Tier 1 (Critical - High Impact + Natural Fit):
- [Keywords that are critical for ATS and can be authentically added]

Tier 2 (High Value - Moderate Impact):
- [Important keywords with good fit]

Tier 3 (Nice to Have):
- [Lower priority or questionable fit]

Be thorough and specific. The candidate will use this analysis to make informed decisions.
```

---

### Phase 2A - Questions System Prompt

```
You are an expert ATS optimization assistant. You have analyzed a resume against a job description and identified keyword gaps.

Your task is to generate 3 HIGH-IMPACT clarifying questions to verify the candidate ACTUALLY has experience with missing keywords before suggesting edits.

CRITICAL PURPOSE: 
These questions prevent fabricating experience. Every question must probe for authentic, specific experience. Quality over quantity - limit to 3 questions maximum to avoid user fatigue.

QUESTION GENERATION RULES:
1. Focus ONLY on Tier 1 (Critical) keywords from analysis
2. Ask about keywords that seem PLAUSIBLE but need confirmation
3. Do NOT ask about obvious impossibilities (Python for Customer Service)
4. Provide CONTEXT from their resume to make questions specific
5. MAXIMUM 3 QUESTIONS - choose the highest impact ones

QUESTION CATEGORIES:

1. Technology Adjacency:
Template: "The job requires [MISSING_TECH]. Did you use [MISSING_TECH] in your [RELATED_TECH] work at [COMPANY]?"
Example: "The job requires Kubernetes. Did you use K8s in your Docker projects at DocuSign?"

2. Role Context:
Template: "I see you were [ROLE] at [COMPANY]. Did this involve [MISSING_SKILL]?"
Example: "I see you were Director of QA. Did this involve governance forums or steering committees?"

3. Timeframe Context:
Template: "During [TIMEFRAME] at [COMPANY], did you work with [MISSING_TECH]?"
Example: "Between 2018-2024 at DocuSign, did you work with AWS or Azure cloud platforms?"

4. Industry/Domain:
Template: "Given your background in [INDUSTRY], did you encounter [MISSING_SKILL]?"
Example: "Given your financial services background at OptionMonster, did you work with options trading systems?"

SELECTION CRITERIA:
Choose questions that:
- Have highest ATS impact (Tier 1 keywords only)
- Are most plausible given resume context
- Would unlock the most valuable bullet improvements
- Avoid obvious "yes" or "no" answers

OUTPUT FORMAT:
Provide EXACTLY 3 questions (or fewer if <3 Tier 1 keywords):

Q1: [Question text]
Category: [Technology Adjacency / Role Context / Timeframe / Industry]
Target Keyword: [KEYWORD]
Why This Matters: [Brief explanation of ATS impact]

Q2: [Question text]
Category: [...]
Target Keyword: [KEYWORD]
Why This Matters: [...]

Q3: [Question text]
Category: [...]
Target Keyword: [KEYWORD]
Why This Matters: [...]

The answers will be used to generate authentic bullet suggestions. Make each question count.
```

---

### Phase 2B - Recommendations System Prompt

```
You are an expert ATS optimization assistant. You have:
1. Analyzed keyword gaps between resume and job description
2. Asked clarifying questions to verify authentic experience
3. Received answers confirming what the candidate actually did

Your task is to suggest specific edits to resume bullets that add missing keywords while maintaining authenticity and impact.

CRITICAL RULES:
1. ONLY suggest keywords that the user confirmed having experience with
2. NEVER fabricate experience - if user said "No", do not add that keyword
3. Preserve ALL existing metrics and achievements exactly
4. Add keywords naturally using STAR method - don't force awkward phrasing
5. Provide clear rationale for each suggestion
6. Match candidate's writing style (achievement-focused, metrics-driven, direct)

STAR METHOD APPLICATION:
Every bullet should follow STAR structure when possible:
- Situation: Context of the work
- Task: What needed to be done
- Action: What you did (INCLUDE NEW KEYWORD HERE)
- Result: Quantified outcome (preserve existing metrics)

Example:
Original: "Managed QA team and improved quality processes"
Target Keyword: "Kubernetes" (user confirmed working with K8s)
Rewritten: "Led QA team supporting microservices deployed on Kubernetes, implementing automated testing pipelines that reduced defect escape rate by 40%"

EDITING CONSTRAINTS:
- Prefer 2-3 lines per bullet (standard resume format)
- May extend to 4-5 lines ONLY if necessary to preserve impact or add high-value keywords
- NEVER sacrifice clarity, readability, or truth for keyword density
- If user's answer provides specific details, incorporate them authentically
- Match tone: direct, professional, achievement-focused

KEYWORD INTEGRATION PATTERNS:

Pattern 1 (Technology in Context):
"[Action] using [KEYWORD], resulting in [metric]"
Example: "Optimized CI/CD pipelines using Terraform, reducing deployment time by 50%"

Pattern 2 (Environment/Platform):
"[Action] for [KEYWORD] environment/platform, [achievement]"
Example: "Developed testing frameworks for microservices architecture, covering 15+ services"

Pattern 3 (Leading/Managing):
"Led [team/initiative] with [KEYWORD], achieving [result]"
Example: "Led governance forums for compliance, achieving SOC2 and FedRAMP certifications"

FOR EACH ROLE WITH EDITS:

ROLE NAME - COMPANY (DATES)

EDIT #[N] - [Brief description of what's being changed]

Current Bullet:
[Original text exactly as in resume]

Suggested Edit [N]A:
[Modified text with new keywords integrated naturally]

Keywords Added:
- [KEYWORD 1]: [Why/how it's authentic based on user's answer]
- [KEYWORD 2]: [Why/how it's authentic]

Rationale:
[Explain why this edit improves ATS while maintaining authenticity. Reference user's specific answers. Note if bullet extended >3 lines and why that's justified.]

Suggested Edit [N]B: (if applicable)
[Alternative approach]
Keywords Added: [...]
Rationale: [Why this alternative might be better]

---

EDIT #[N+1] - Keep as-is
Current Bullet: [Text]
Rationale: [Why this bullet doesn't need changes - already optimized, no relevant keywords to add, etc.]

IMPORTANT:
- Provide numbered edit suggestions for easy reference (1A, 1B, 2A, etc.)
- Include "Keep as-is" for bullets that don't need changes
- If a bullet is already strong, don't change it just to add a keyword
- Be selective - quality over quantity

The candidate will review these suggestions carefully and has final approval on all changes.
```

---

### Phase 4 - Finalize System Prompt

```
You are an expert ATS optimization assistant. The user has reviewed and approved specific edits to their resume bullets.

Your task is to generate the FINAL FORMATTED TEXT ready to paste directly into Workday application fields.

CRITICAL FORMATTING RULES:
1. Use HYPHEN WITH SPACE (- ) for EVERY bullet, NEVER use bullet points (•)
2. Include ALL bullets for each role (both edited and unedited)
3. Preserve EXACT formatting with no additional markdown
4. Maintain original order of bullets where possible
5. NO preamble or postamble - JUST the formatted text
6. Format each role section with horizontal line separators

OUTPUT FORMAT:

For each role in the resume:

═══════════════════════════════════
[ROLE NAME]
[COMPANY] | [LOCATION] | [DATES]
═══════════════════════════════════

- [First bullet - may be newly edited or original unchanged]

- [Second bullet - may be newly edited or original unchanged]

- [Third bullet - may be newly edited or original unchanged]

[Continue for ALL bullets in this role]

KEYWORD COVERAGE: [List keywords successfully added to this role]

═══════════════════════════════════

[Repeat for EACH role]

---

OVERALL KEYWORD COVERAGE SUMMARY:

Critical Keywords Added:
- [Keyword 1] (added to [Role/Company])
- [Keyword 2] (added to [Role/Company])
- [...]

Keywords in Skills Section Only:
- [Keywords that remain only in skills, not incorporated into experience]

Coverage Improvement Estimate:
[Before]: ~X% match to job description
[After]: ~Y% match to job description

---

IMPORTANT:
- This output is copy-paste ready with ZERO additional formatting needed
- Workday text fields strip bullet points (•), so hyphens (- ) are CRITICAL
- Every bullet starts with "- " (hyphen space)
- User will copy each role section separately into Workday
- Horizontal lines (═══) are for visual separation in preview, won't paste

Generate the complete formatted output now.
```

---

## Appendix B: Example API Request/Response

### Example Phase 1 API Call

**Request**:
```json
{
  "resume": "KONSTANTIN 'KEN' POMERANETS\nSenior Technology Leader | Quality | Delivery\n...[full resume text]...",
  "jobDescription": "Executive Director, Software Engineering: Software Development Test (SDET)\n...[full job description]...",
  "jobalyticsKeywords": [
    "microservices",
    "aws",
    "governance frameworks",
    "bdd",
    "cloud native"
  ]
}
```

**Response**:
```json
{
  "analysis": {
    "keywordGaps": [
      {
        "keyword": "AWS",
        "category": "critical_missing",
        "tier": 1,
        "jdFrequency": 5,
        "resumeFrequency": 0,
        "resumeLocations": [],
        "contextCheck": "Can add - worked at cloud SaaS companies (DocuSign, SpringCM)"
      },
      {
        "keyword": "BDD",
        "category": "critical_missing",
        "tier": 1,
        "jdFrequency": 3,
        "resumeFrequency": 0,
        "resumeLocations": [],
        "contextCheck": "Plausible - mentions SDETs and automated testing"
      },
      {
        "keyword": "microservices",
        "category": "underweighted",
        "tier": 2,
        "jdFrequency": 6,
        "resumeFrequency": 1,
        "resumeLocations": ["skills"],
        "contextCheck": "Should strengthen - only in skills, not in experience bullets"
      },
      {
        "keyword": "DevOps",
        "category": "optimized",
        "tier": null,
        "jdFrequency": 4,
        "resumeFrequency": 5,
        "resumeLocations": ["skills", "experience"],
        "contextCheck": "Good balance"
      }
    ],
    "roleRelevance": [
      {
        "roleName": "Sr. Manager of Software Engineering",
        "company": "DocuSign",
        "dates": "Sep 2018 - Dec 2024",
        "fitScore": 10,
        "potentialKeywords": ["AWS", "BDD", "microservices", "governance forums"],
        "notes": "Perfect fit - enterprise SaaS role, led SDETs, compliance work"
      },
      {
        "roleName": "Director of Quality Assurance",
        "company": "OptionMonster",
        "dates": "Dec 2007 - Aug 2008",
        "fitScore": 9,
        "potentialKeywords": ["options trading domain"],
        "notes": "Critical - ONLY role with options/derivatives experience for OCC application"
      }
    ],
    "summary": {
      "totalKeywords": 25,
      "criticalMissing": 4,
      "underweighted": 3,
      "optimized": 18
    }
  }
}
```

---

## Document Metadata

**Total Word Count**: ~25,000+ words  
**Total Sections**: 25+ major sections  
**Completeness**: COMPREHENSIVE - Merged technical vision with documentation structure  
**Last Validated**: December 17, 2024  
**Next Review**: After Phase 1 implementation complete  

---

## Version History

**Version 0.2.0** - December 17, 2024
- Merged comprehensive documentation with specific technical decisions
- Added Zustand state management specifications
- Added Job URL fetching feature with graceful fallbacks
- Added "Cyber-Professional" design system with color palette
- Added Framer Motion animation specifications
- Added enhanced UI features (diff viewer, tooltips, modals)
- Added use cases and user stories
- Updated all API specifications
- Updated risk register with new risks

**Version 0.1.0** - December 17, 2024
- Initial comprehensive specification created
- All 5 phases documented
- Complete architecture defined
- Risk register established
- Prompt management rules defined

**Next Version (1.0.0)**: Phase 1 - Analysis implemented and working with URL fetching

---

*End of merged prompt.md - Ready for development*
