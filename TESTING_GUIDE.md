# Testing Guide - Job Notification Tracker

## Quick Start

1. **Open the app:**
   - Navigate to `c:\Users\Harsh\KODNEST\`
   - Open `app.html` in your browser (Chrome, Firefox, Edge)

2. **You should see:**
   - Landing page with "Stop Missing The Right Jobs" headline
   - "Start Tracking" button

---

## Test Scenarios

### 1. Landing Page
- ✅ Large serif headline
- ✅ Subtitle text
- ✅ Deep red "Start Tracking" button
- ✅ Off-white background
- ✅ Centered layout

**Action**: Click "Start Tracking" → Should go to Settings

---

### 2. Dashboard (Main Feature)
**Navigate to**: Click "Dashboard" in nav OR go to `#/dashboard`

**You should see:**
- ✅ "Dashboard" page header
- ✅ "60 jobs available" subtitle
- ✅ Filter bar with:
  - Search input
  - Location dropdown
  - Mode dropdown
  - Experience dropdown
  - Source dropdown
  - Sort dropdown
  - Clear button
- ✅ Grid of 60 job cards (3 columns on desktop)

**Each job card shows:**
- ✅ Job title (serif font)
- ✅ Company name
- ✅ Source badge (LinkedIn/Naukri/Indeed with colors)
- ✅ Location, Mode, Experience with icons
- ✅ Salary in deep red
- ✅ Posted time ("Today", "2 days ago")
- ✅ Three buttons: View, Save, Apply

---

### 3. Test Filtering

**Keyword Search:**
1. Type "React" → Should show only React jobs
2. Type "Amazon" → Should show only Amazon jobs
3. Type "Backend" → Should show backend roles
4. Clear search → All 60 jobs return

**Location Filter:**
1. Select "Bangalore" → Should show ~30 jobs
2. Select "Chennai" → Should show ~8 jobs
3. Select "All Locations" → All jobs return

**Mode Filter:**
1. Select "Remote" → Should show ~10 jobs
2. Select "Hybrid" → Should show ~15 jobs
3. Select "Onsite" → Should show ~35 jobs

**Experience Filter:**
1. Select "Fresher" → Should show ~15 jobs
2. Select "1-3" → Should show ~25 jobs
3. Select "3-5" → Should show ~10 jobs

**Source Filter:**
1. Select "LinkedIn" → Should show ~25 jobs
2. Select "Naukri" → Should show ~20 jobs
3. Select "Indeed" → Should show ~15 jobs

**Sort:**
1. "Latest First" → Jobs with 0 days ago appear first
2. "Oldest First" → Jobs with 10 days ago appear first

**Combined Filters:**
1. Bangalore + Remote + 1-3 years → Should show subset
2. Clear button → All filters reset

---

### 4. Test Job Modal

**Action**: Click "View" button on any job card

**You should see:**
- ✅ Modal overlay (dark background)
- ✅ White modal card in center
- ✅ Large job title
- ✅ Company name
- ✅ Location, Mode, Experience, Salary
- ✅ Full description (3-6 lines)
- ✅ Skills section with tags
- ✅ "Apply Now" button
- ✅ "Close" button
- ✅ X button in top right

**Actions:**
1. Click "Apply Now" → Opens URL in new tab
2. Click "Close" → Modal closes
3. Click X → Modal closes
4. Click overlay → Modal closes

---

### 5. Test Save Functionality

**On Dashboard:**
1. Click "Save" on any job → Button changes to "❤️ Saved" with pink background
2. Click "Saved" again → Unsaves (back to "🤍 Save")
3. Save 5 different jobs
4. Refresh page → Saved jobs persist

**On Saved Page:**
1. Navigate to "Saved" in nav
2. Should see all saved jobs
3. Can view details
4. Can unsave
5. Can apply
6. If no saved jobs → See empty state with "Browse Jobs" button

---

### 6. Test Apply Functionality

**Action**: Click "Apply" on any job card

**You should see:**
- ✅ New tab opens
- ✅ URL looks realistic (company domain)

---

### 7. Test Navigation

**Top Nav (Desktop):**
- ✅ Click "Home" → Landing page
- ✅ Click "Dashboard" → Job grid
- ✅ Click "Saved" → Saved jobs
- ✅ Click "Digest" → Empty state
- ✅ Click "Settings" → Settings form
- ✅ Click "Proof" → Checklist
- ✅ Active link has red underline

**Mobile Nav:**
1. Resize browser to <768px
2. Should see hamburger menu (☰)
3. Click hamburger → Menu slides down
4. Click any link → Navigates and menu closes
5. Active link has left border + background

---

### 8. Test Responsive Design

**Desktop (>768px):**
- ✅ 3-column job grid
- ✅ Horizontal nav links
- ✅ Wide filter bar

**Tablet (≤768px):**
- ✅ 1-column job grid
- ✅ Hamburger menu
- ✅ 2-column filter grid

**Mobile (≤480px):**
- ✅ 1-column everything
- ✅ Stacked filters
- ✅ Full-width buttons

---

### 9. Sample Jobs to Look For

**Internships:**
- "SDE Intern" at Amazon (Bangalore, Hybrid, ₹25k–₹40k/month)
- "Frontend Intern" at Razorpay (Bangalore, Remote, ₹30k–₹50k/month)
- "QA Intern" at Flipkart (Bangalore, Hybrid, ₹20k–₹35k/month)

**Fresher Roles:**
- "Graduate Engineer Trainee" at Infosys (Mysore, Onsite, 3.6–4 LPA)
- "Python Developer (Fresher)" at TCS (Pune, Onsite, 3.5–5 LPA)
- "React Developer (Fresher)" at Zoho (Chennai, Onsite, 4–6 LPA)

**Mid-Level:**
- "React Developer" at Freshworks (Chennai, Hybrid, 8–12 LPA)
- "Backend Engineer" at Paytm (Noida, Onsite, 10–15 LPA)
- "Full Stack Developer" at Razorpay (Bangalore, Hybrid, 12–18 LPA)

**Senior:**
- "Senior Backend Developer" at Amazon (Hyderabad, Onsite, 25–35 LPA)
- "Tech Lead - Full Stack" at CRED (Bangalore, Onsite, 30–45 LPA)
- "Senior Data Scientist" at Swiggy (Bangalore, Hybrid, 20–30 LPA)

---

## Expected Behavior

### Empty States

**No saved jobs:**
- Title: "No saved jobs"
- Description: "Jobs you save will appear here for easy access."
- Button: "Browse Jobs" → Dashboard

**No filter results:**
- Title: "No jobs found"
- Description: "Try adjusting your filters to see more results."
- Button: "Clear Filters" → Resets filters

---

## Design Verification

**Colors:**
- ✅ Background: Off-white (#F7F6F3)
- ✅ Accent: Deep red (#8B0000)
- ✅ Text: Near black (#111111)
- ✅ Borders: Light gray (#D4D2CC)

**Typography:**
- ✅ Headings: Crimson Pro (serif)
- ✅ Body: Inter (sans-serif)
- ✅ Job titles: Serif
- ✅ Metadata: Sans-serif

**Spacing:**
- ✅ Consistent gaps
- ✅ High whitespace
- ✅ Calm, not cramped

**Interactions:**
- ✅ Smooth transitions (150ms)
- ✅ Subtle hover effects
- ✅ No jarring animations

---

## Known Limitations (By Design)

❌ Preference matching not implemented  
❌ Digest generation not implemented  
❌ Settings save not functional  
❌ No backend/API calls  
❌ No job scoring/ranking  

**This is intentional** - focus was on clean rendering and realistic data.

---

## Browser Compatibility

**Tested/Compatible:**
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari

**Requirements:**
- ✅ JavaScript enabled
- ✅ LocalStorage enabled
- ✅ Modern browser (ES6 support)

---

## Performance Expectations

- ✅ 60 jobs render instantly
- ✅ Filtering is real-time
- ✅ No lag or delays
- ✅ Smooth scrolling
- ✅ Modal opens/closes smoothly

---

## Troubleshooting

**Jobs not showing:**
1. Check browser console for errors
2. Verify `jobs-data.js` loaded
3. Check network tab for 404s

**Filters not working:**
1. Check console for errors
2. Try clearing and re-applying
3. Refresh page

**Saved jobs not persisting:**
1. Check if localStorage is enabled
2. Check browser privacy settings
3. Try different browser

**Modal not opening:**
1. Check console for errors
2. Try different job card
3. Refresh page

---

## Success Criteria

✅ All 60 jobs visible on dashboard  
✅ All filters work correctly  
✅ Save/unsave functionality works  
✅ Modal shows full job details  
✅ Apply opens URLs in new tab  
✅ Saved page shows saved jobs  
✅ Design matches KodNest Premium system  
✅ Responsive on mobile  
✅ No console errors  

---

**Ready to test!** Open `app.html` and follow the scenarios above.
