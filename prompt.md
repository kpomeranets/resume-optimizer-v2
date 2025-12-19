# System Prompt: Resume Optimizer App (V2 - Robust Architecture)

**Context**: You are an expert Full Stack Engineer and Product Manager.
**Goal**: Build a production-grade, AI-powered Resume Optimizer web application.
**Reference**: This project effectively recreates and matures a prototype that had the following workflow: Input -> Analysis -> Interactive Refinement -> Export.

## 1. Technical Stack (Recommended for Robustness)
*   **Framework**: Next.js 14+ (App Router) with TypeScript.
*   **Styling**: Tailwind CSS (for layout/responsiveness) + Custom CSS Modules (for complex glassmorphism effects) OR styled-components.
*   **State Management**: Zustand or React Context (for complex wizard state).
*   **Backend**: Next.js API Routes (Serverless Functions).
*   **AI Integration**: Vercel AI SDK (streaming responses) with Anthropic Claude (Claude 3.5 Sonnet or Claude Opus 4).
*   **File Handling**:
    *   `pdf-parse` (Server-side PDF extraction).
    *   `mammoth` (Server-side Word extraction).
    *   `docx` (Library for generating downloadable .docx files).

## 2. Detailed Functional Requirements & Behavior

### Phase 1: Input & Ingestion
**Goal**: Frictionless entry of data with robust error recovery.

*   **Multi-mode Input Behavior**:
    *   **File Upload**:
        *   Accepts `.pdf`, `.docx`, `.txt`.
        *   **Behavior**: On drop, immediately show a "Parsing..." spinner. If parsing fails (e.g., encrypted PDF), automatically fallback to showing the "Paste Text" area with a toast message: "Could not read file. Please paste text."
    *   **Job URL Fetching**:
        *   **Behavior**: User pastes URL -> clicking "Fetch" triggers Server-Side Proxy.
        *   **Constraint**: Use a SINGLE, reactive text area for both the fetched content and manual editing. Do not render duplicate inputs.
        *   **Edge Case**: If the endpoint returns 403/401 (blocked by scraping protection like Cloudflare), the UI must not crash. Instead, display a friendly "Access Denied" modal: "This site inhibits automated reading. Please copy-paste the Job Description manually."
    *   **Validation**: The "Next" button is disabled until both Resume ( > 50 words) and Job Description ( > 50 words) are detected.

### Phase 2: AI Analysis (Deep Analysis Logic)
**Goal**: Beyond simple keyword matching; understand semantic gaps.

*   **Keyword Gap Analysis**:
    *   **Logic**:
        1.  Extract "Hard Skills" (Languages, Tools) and "Soft Skills" (Leadership, Agile) from the JD.
        2.  Cross-reference with Resume text.
        3.  **Categorization**:
            *   **CRITICAL MISSING**: Keywords present >3 times in JD but 0 times in Resume.
            *   **UNDERWEIGHTED**: Present in JD >3 times, but only once in Resume (or only in "Skills" section, not in "Experience").
            *   **OPTIMIZED**: Good balance.
    *   **Implementation Note**: 
        *   The AI prompt must explicitly instruct Claude to **pay attention to keyword frequency** in the Job Description.
        *   Claude should add weight and priority to keywords based on their occurrence count in the JD.
        *   Claude determines the optimal weighting strategy (raw counts, categories, or sorted lists).
*   **Authenticity Check**:
    *   The AI must NOT blindly add keywords. It must check the context.
    *   **Bad**: Adding "Python" to a "Customer Service" role.
    *   **Good**: Suggesting "Did you use *Python* for this data entry automation?" via the Q&A interface.

### Phase 3: The "Authenticity Wizard" (Clarification Loop)
**Goal**: Ensure the generated bullets are true to the user's actual experience.

*   **STEP 1: Keyword Selection Interface**:
    *   **Trigger**: After AI analysis, present all CRITICAL MISSING and UNDERWEIGHTED keywords to the user.
    *   **UI**: Checkbox interface where user selects keywords they believe they have experience with.
    *   **Behavior**: User can select all, some, or none of the keywords before proceeding.

*   **STEP 2: Clarifying Questions Agent** (for selected keywords):
    *   **Trigger**: For each keyword the user selected, AI asks clarifying questions.
    *   **Behavior**:
        *   AI asks questions to gather sufficient context about the user's experience with the keyword.
        *   AI determines when it has "enough" information and automatically moves to the next keyword.
        *   Maximum 10 questions per keyword, but AI should aim for quality over quantity (may only need 2-3 questions).
    *   **User Controls**:
        *   **"Skip Question" button**: User can skip any individual question if not relevant.
        *   **"Skip to Next Keyword" button**: User can manually advance to the next keyword at any time.
    *   **UI**: Chat-like interface with system messages for transitions.
    *   **Handling Insufficient Experience**:
        *   IF user clicks "Skip to Next Keyword" without providing any substantive answers OR explicitly states they don't have experience:
            *   Display message in chat: "Noted. [Keyword] will not be included in the recommendations."
            *   System marks keyword as "excluded" for recommendation generation.
            *   Move to next selected keyword or proceed to STEP 3.

*   **STEP 3: Secondary Keyword Suggestion**:
    *   **Trigger**: After completing Q&A for all user-selected keywords.
    *   **Behavior**:
        *   AI analyzes the user's answers to selected keywords AND the original resume text.
        *   AI identifies unselected keywords that the user might actually have experience with based on context clues.
        *   AI presents these overlooked keywords to the user with rationale.
    *   **UI**: 
        *   Display each suggested keyword with 2-3 sentences explaining why it might be relevant.
        *   Example: "**Docker**: Based on your answers about Kubernetes and your mention of containerization in your resume, you may have Docker experience. Would you like to discuss this keyword?"
    *   **User Actions**:
        *   User can accept or reject each suggested keyword.
        *   IF user accepts any suggested keywords: Return to STEP 2 (Q&A loop) for those keywords only.
        *   IF user rejects all or none suggested: Proceed to STEP 4.

*   **STEP 4: Generate Recommendations**:
    *   **Trigger**: User clicks "Generate Recommendations" button (appears after completing all keyword Q&A).
    *   **Behavior**: System compiles all keyword experiences and generates optimized resume recommendations.

### Phase 4: Recommendation Engine (The Core Value)
**Goal**: Present changes clearly and educate the user.

*   **Bullet Rewriting Logic**:
    *   **Input**: Old Bullet + Context + User Answers + Target Keywords.
    *   **Output**: New Bullet (STAR Method: Situation, Task, Action, Result).
    *   **Constraint**: Max 2 lines per bullet (standard resume format).
    *   **Scope**: Generate recommendations for ALL included keywords based on user's Q&A responses.

*   **Recommendations Display Interface**:
    *   **Structure**:
        *   Separate read-only text box for each resume section:
            *   Summary (optional)
            *   Experience (with sub-sections for each job in work history)
            *   Skills
            *   Education
        *   Each job in the Experience section should be displayed in its own sub-section.
    *   **Visuals**: 
        *   Text boxes are read-only for initial review.
        *   Clean, organized layout showing optimized content with keywords integrated.
    *   **User Actions**:
        *   **"Accept All Changes" button**: Applies all recommendations and proceeds to export.
        *   **Individual Edit capability**: User can request modifications to specific sections (separate edit functionality to be designed).
        *   **Export to DOCX button**: Available after accepting changes (implementation in Phase 5).

*   **Diff Viewer UI** (Phase 5 Feature):
    *   **Visuals**: Use green highlights for added text, red strikethrough for deleted text.
    *   **Interactive Tooltips**: Hovering over a bolded keyword shows: "Added because 'Cloud Governance' appears 5x in Job Description."
    *   **Note**: Diff viewer is marked as Phase 5 due to complexity.

### Phase 5: Export & Delivery (Future Implementation)
**Goal**: Provide ATS-compatible resume output and persistent keyword storage.

*   **Export Format Specs**:
    *   **ATS Compatibility**: Use standard Arial/Calibri fonts. Avoid tables, columns, or graphics.
    *   **Structure**:
        1.  **Header**: Name, Contact (preserved from original).
        2.  **Summary**: (Optional AI rewrite).
        3.  **Experience**: The optimized content with keyword integration.
        4.  **Skills**: Updated list including the new keywords.
    *   **File naming**: `[Role]_[Company]_[Date].docx`

*   **Keyword Answer Storage & Retrieval**:
    *   **Storage Scope**: 
        *   **Global across all sessions**: All keyword Q&A pairs stored together (e.g., all "Python" answers available regardless of specific resume/JD combination).
        *   **User-configurable**: Users can choose to reuse previous answers or start fresh for each new optimization session.
    *   **Data Persistence**: Stored indefinitely in browser localStorage until user clears browser data or manually deletes.
    *   **Management Interface**:
        *   Settings/History page where users can:
            *   View all stored keyword answers
            *   Edit existing answers
            *   Delete individual keyword entries
            *   **"Clear All Data" button**: Wipes all stored keyword answers
    *   **Integration**: When user encounters a previously-answered keyword, system can auto-populate or suggest using stored answers.

*   **Advanced State Management** (Phase 5):
    *   Upgrade Zustand store to track:
        *   Current keyword being discussed
        *   Keywords marked as "skip" vs "include"
        *   User answers per keyword with timestamps
        *   Session history and restoration capability

## 3. Use Cases

### Use Case A: The "Technical Pivot"
*   **User**: A Java Developer applying for a Python role.
*   **Scenario**: Resume is full of Java keywords. JD wants Python.
*   **App Behavior**:
    1.  Analysis identifies "Python" as **Critical Missing**.
    2.  User selects "Python" checkbox in keyword selection interface.
    3.  AI asks: "Have you used Python in any side projects or scripting at [Current Job]?"
    4.  User: "Yes, wrote scripts for CI/CD."
    5.  AI asks 1-2 follow-up questions for details.
    6.  **Result**: System generates recommendation rewriting a "CI/CD" bullet to: *"Automated CI/CD pipelines using **Python** scripts, reducing deployment time by 40%."*

### Use Case B: The "Blocked URL"
*   **User**: Pastes a LinkedIn Job URL.
*   **Scenario**: LinkedIn blocks the server-side fetch.
*   **App Behavior**:
    1.  Fetch fails with 4xx error.
    2.  Modal appears: "LinkedIn doesn't allow direct access. Please copy the text from the job post and paste it here."
    3.  User pastes text.
    4.  App proceeds normally (graceful recovery).

### Use Case C: The "Overlooked Skill"
*   **User**: Applying for DevOps role, selects "Kubernetes" and "CI/CD" but misses "Docker".
*   **Scenario**: User answered Kubernetes questions mentioning container orchestration.
*   **App Behavior**:
    1.  After completing Kubernetes Q&A, system analyzes context.
    2.  Secondary suggestion appears: "**Docker**: You mentioned containerization in your Kubernetes answers. Docker is listed 4 times in the job description. Would you like to discuss your Docker experience?"
    3.  User accepts.
    4.  System proceeds with Docker Q&A before generating final recommendations.

## 4. UI/UX Design System "North Star" (Phase 5 Refinement)
*   **Aesthetic**: "Cyber-Professional". Dark mode default.
    *   **Palette**: Tailwind CSS theme system with customizable colors (specific palette refinement in Phase 5).
    *   **Core Colors Reference**: Deep Navy (`#0F172A`) background. Electric Blue (`#38BDF8`) for primary actions. Muted Slate (`#94A3B8`) for secondary text.
*   **Motion**:
    *   **Page Transitions**: Framer Motion `AnimatePresence` for smooth wizard step changes.
    *   **Success State**: Confetti or specific "Checkmark" animation when "Approve All" is clicked (Phase 5 feature).

## 5. Security & Privacy
*   **Data Retention**: 
    *   Resume data stored in browser `localStorage` for session persistence and recovery.
    *   Keyword Q&A data stored in `localStorage` for cross-session reuse (see Phase 5 for detailed implementation).
*   **No Database**: V2 does NOT require a database. All storage is client-side via localStorage.
*   **Data Management**: 
    *   Users have full control over their data via Settings/History interface.
    *   "Clear All Data" button available for complete data wipe.
    *   No server-side data persistence beyond temporary session handling.

## 6. Implementation Priority Order

**Priority 1**: Conflict 1 Resolution
*   Update AI analysis prompt to instruct Claude to pay attention to keyword frequency
*   Modify `/api/analyze` route to include frequency weighting instructions

**Priority 2**: Conflict 2 Resolution  
*   Implement keyword selection checkbox interface
*   Build multi-question Q&A flow with skip controls
*   Create secondary keyword suggestion logic
*   Add "Generate Recommendations" trigger

**Priority 3**: Conflict 3 Resolution
*   Build Recommendation Engine API route using Claude
*   Create recommendations display interface with sectioned text boxes
*   Implement "Accept All Changes" workflow
*   Stub out DOCX export (full implementation in Phase 5)

**Priority 4**: Conflict 6 Resolution
*   Implement localStorage persistence for keyword Q&A data
*   Create Settings/History management interface
*   Add "Clear All Data" functionality
*   Build keyword answer retrieval and reuse logic

**Phase 5 (Future Work)**:
*   DOCX export with ATS-compliant formatting
*   Diff viewer with green/red highlights and interactive tooltips
*   Success animations (confetti)
*   UI/UX refinement to match cyber-professional aesthetic
*   Advanced state management upgrades

## 7. Development Notes

*   **File Structure**: Maintain clean separation of concerns with components in `/components/features/` and API routes in `/app/api/`.
*   **Error Handling**: All API routes must handle errors gracefully with user-friendly messages.
*   **Testing Strategy**: Manual testing with real resumes and job descriptions to validate AI responses.
*   **Performance**: Minimize unnecessary re-renders with proper React memoization and Zustand selectors.
*   **Accessibility**: Ensure all interactive elements have proper ARIA labels and keyboard navigation support.
