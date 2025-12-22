---
# PROMPT.MD META-INSTRUCTIONS

## Document Purpose and Rules

**This file (prompt.md) is the SINGLE SOURCE OF TRUTH for the entire Resume Optimizer V2 application.**

### Mandatory Rules:
1. **Always Update**: prompt.md MUST be updated with every code change, new requirement, clarification, or decision
2. **Sufficient Detail**: The level of detail must be sufficient to fully recreate the entire app using ONLY this file with no additional context
3. **Living Document**: This is a living document that evolves with the project
4. **Conflict Resolution**: Any contradiction between prompt.md and actual code must be:
   - Called out explicitly
   - Explained with clear reasoning
   - Include pros, cons, and risks of the change
   - Resolved by updating either code or prompt.md
5. **Version Control**: All changes to prompt.md should be tracked with:
   - Date of change
   - What changed
   - Why it changed
6. **Implementation Fidelity**: Code must match prompt.md specifications exactly unless explicitly documented otherwise

### When Editing Code:
- Read prompt.md first
- Make code changes
- Update prompt.md to reflect changes
- Document any deviations with rationale

### Document Structure:
- Technical Stack
- Phase-by-phase functional requirements
- API specifications
- Component specifications
- State management structure
- Use cases and examples
- Testing requirements
- Deployment checklist

**VERSION**: 2.1
**LAST MAJOR UPDATE**: December 19, 2025
---

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
*   **Authenticity Check**:
    *   The AI must NOT blindly add keywords. It must check the context.
    *   **Bad**: Adding "Python" to a "Customer Service" role.
    *   **Good**: Suggesting "Did you use *Python* for this data entry automation?" via the Q&A interface.

### Phase 3: The "Authenticity Wizard" (Clarification Loop)
**Goal**: Ensure the generated bullets are true to the user's actual diverse experience.

*   **Clarifying Questions Agent**:
    *   **Trigger**: Before generating new bullets, the AI analyzes the "Critical Missing" keywords.
    *   **Behavior**:
        *   If "Kubernetes" is missing but "Docker" is present, allow the AI to ask: *"The job requires Kubernetes. Did you use K8s in your Docker projects at [Company]?"*
        *   Limit to 3 high-impact questions to avoid user fatigue.
    *   **UI**: A chat-like or form-like interface where the user answers "Yes (details...)", "No", or "Skip".

### Phase 4: Recommendation Engine (The Core Value)
**Goal**: Present changes clearly and educate the user.

*   **Bullet Rewriting Logic**:
    *   **Input**: Old Bullet + Context + User Answers + Target Keywords.
    *   **Output**: New Bullet (STAR Method: Situation, Task, Action, Result).
    *   **Constraint**: Max 2 lines per bullet (standard resume format).
*   **Diff Viewer UI**:
    *   **Visuals**: Use green highlights for added text, red strikethrough for deleted text.
    *   **Interactive Tooltips**: Hovering over a bolded keyword shows: "Added because 'Cloud Governance' appears 5x in Job Description."
*   **Approval Workflow**:
    *   "Approve All" button for confident users.
    *   "Edit" button for each suggestion allow the user to tweak the phrasing before accepting.

### Phase 5: Export & Delivery
*   **Format Specs**:
    *   **ATS Compatibility**: Use standard Arial/Calibri fonts. Avoid tables, columns, or graphics.
    *   **Structure**:
        1.  **Header**: Name, Contact (preserved from original).
        2.  **Summary**: (Optional AI rewrite).
        3.  **Experience**: The optimized content.
        4.  **Skills**: Updated list including the new keywords.
*   **File naming**: `[Role]_[Company]_[Date].docx`

## 3. Use Cases

### Use Case A: The "Technical Pivot"
*   **User**: A Java Developer applying for a Python role.
*   **Scenario**: Resume is full of Java keywords. JD wants Python.
*   **App Behavior**:
    1.  Identifies "Python" as **Critical Missing**.
    2.  Asks: "Have you used Python in any side projects or scripting at [Current Job]?"
    3.  User: "Yes, wrote scripts for CI/CD."
    4.  **Result**: Rewrites a "CI/CD" bullet to: *"Automated CI/CD pipelines using **Python** scripts, reducing deployment time by 40%."*

### Use Case B: The "Blocked URL"
*   **User**: Pastes a LinkedIn Job URL.
*   **Scenario**: LinkedIn blocks the server-side fetch.
*   **App Behavior**:
    1.  Fetch fails with 4xx error.
    2.  Modal appears: "LinkedIn doesn't allow direct access. Please copy the text from the job post and paste it here."
    3.  User pastes text.
    4.  App proceeds normally (graceful recovery).

## 4. UI/UX Design System "North Star"
*   **Aesthetic**: "Cyber-Professional". Dark mode default.
    *   **Palette**: Deep Navy (`#0F172A`) background. Electric Blue (`#38BDF8`) for primary actions. Muted Slate (`#94A3B8`) for secondary text.
*   **Motion**:
    *   **Page Transitions**: Framer Motion `AnimatePresence` for smooth wizard step changes.
    *   **Success State**: Confetti or specific "Checkmark" animation when "Approve All" is clicked.

## 5. Security & Privacy
*   **Data Retention**: Resume data should be stored in `localStorage` (Client) or ephemeral session storage (Server).
*   **No Database**: V2 should NOT require a database unless user accounts are explicitly added. Optimize for "Session-based" usage.

## 6. PDF Parsing Debugging & Troubleshooting

### Common PDF Parsing Issues

**Issue: DOMMatrix/Canvas Errors**
- **Error**: `ReferenceError: DOMMatrix is not defined`
- **Cause**: `pdf-parse` requires canvas dependencies (DOMMatrix, ImageData, Path2D)
- **Solution**: Install `canvas` package: `npm install canvas`
- **Alternative**: Use text-only PDFs or implement client-side parsing

**Issue: Encrypted PDFs**
- **Error**: PDF parsing fails silently or returns empty text
- **Cause**: Password-protected or DRM-protected PDFs cannot be parsed
- **Solution**: User must unlock PDF or paste text manually

**Issue: Image-based PDFs**
- **Error**: Parsing succeeds but returns no text
- **Cause**: PDF contains scanned images without OCR text layer
- **Solution**: Requires OCR processing (not implemented) - user must paste text manually

### Debugging Approach

1. **Check Server Logs**: Look for `[PDF Parse]` prefixed console messages showing:
   - File details (name, type, size)
   - Buffer creation status
   - Specific error messages with type and stack trace

2. **Check Client Logs**: Look for `[FileUpload]` prefixed messages showing:
   - API response status and data
   - Detailed error information

3. **Error Message Format**: API returns structured errors:
   ```json
   {
     "error": "PDF parsing failed",
     "details": "Actual error message",
     "errorType": "ReferenceError",
     "suggestion": "User-friendly suggestion"
   }
   ```

4. **Fallback Behavior**: UI automatically shows paste text area with detailed error message

### Recommended Fixes

- **For Development**: Install all dependencies including `canvas`
- **For Production**: Consider client-side PDF parsing or server with proper canvas support
- **User Experience**: Always provide manual text paste fallback
