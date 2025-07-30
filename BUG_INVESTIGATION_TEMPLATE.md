# Bug Investigation Template

Copy and fill out this template when reporting bugs for faster diagnosis:

## 1. Bug Summary
**One-sentence description of the problem:**
_Example: "The application shows a blank white screen when clicking the scan button"_

## 2. Trigger Action
**What specific action causes the bug?**
_Example: "Click the 'Start Scan' button on the homepage"_

## 3. Current Route/Page
**What page/URL were you on when the bug occurred?**
_Example: "Homepage at /"_

## 4. Expected vs Actual Behavior
**Expected:** _What should happen?_
**Actual:** _What actually happens?_

## 5. Visual Evidence
**Attach screenshot or describe what you see:**
_Example: "Blank white screen" or "Error message saying 'Cannot read property...'"_

## 6. Console Errors (Critical!)
**Check browser console (F12) and paste any red errors:**
```
Paste console errors here
```

## 7. Steps to Reproduce
1. Step one
2. Step two  
3. Step three
4. Bug occurs

## 8. Suspected Component/File (if known)
**Which component or file might be causing this?**
_Example: "Probably the ScanResults component or Index page"_

## 9. Recent Changes
**Did this work before? What changed recently?**
_Example: "Worked yesterday, started after adding the new scan feature"_

## 10. Environment
- **Browser:** Chrome/Firefox/Safari + version
- **Device:** Desktop/Mobile
- **Development/Production:** Which environment?

---

## Quick Checklist for Common Issues:
- [ ] Check console for React errors
- [ ] Verify network requests are successful  
- [ ] Confirm the component is actually rendering
- [ ] Check if data/props are being passed correctly
- [ ] Look for typos in variable names or imports

**Tip:** The more specific and detailed your bug report, the faster I can identify and fix the issue!