# Quick Start Guide - Testing New Features

## Feature 1: Difficulty Level Tags

### Quick Test (5 minutes)

1. **Start the application**
   ```bash
   # Terminal 1 - Backend
   cd Backend
   npm start

   # Terminal 2 - Frontend
   cd Frontend
   npm start
   ```

2. **Login as Teacher and Create Assignment**
   - Navigate to Teacher Dashboard
   - Click "Create New Assignment"
   - Fill in assignment details:
     - Title: "Sum of Two Numbers"
     - Type: "Programming"
     - Class: "10"
     - Due Date: (any future date)
     - Points: "100"
     - **Difficulty Level: Select "Easy"** ← NEW FIELD
   - Click "Create Assignment"

3. **Verify Difficulty Display (Teacher View)**
   - Assignment appears in list with **Green badge "Easy"**
   - Try again with "Medium" (Yellow badge) and "Hard" (Red badge)

4. **Verify Difficulty Display (Student View)**
   - Logout and login as Student
   - Go to Student Dashboard
   - See assignments with difficulty badges:
     - Easy = Green
     - Medium = Yellow  
     - Hard = Red

5. **View Assignment Details**
   - Click on a Programming assignment
   - See title and difficulty badge in the editor header

---

## Feature 2: AI Feedback Generation

### Quick Test (5 minutes)

1. **Submit Assignment as Student**
   - Go to Student Dashboard
   - Click on any assignment
   - Complete and submit

2. **Grade Submission as Teacher**
   - Go to Teacher Dashboard
   - Click "View Submissions" for any assignment
   - Open submission details
   - Enter a score (e.g., 85) and click "Grade"

3. **Check Feedback**
   - Logout and login as the Student who submitted
   - Go to Student Dashboard
   - Click on the assignment
   - Scroll to "Your Grade" section
   - Should see:
     - **Teacher Feedback:** (whatever you entered)
     - **AI Feedback:** Auto-generated based on score!

4. **Test Different Scores**
   - Test with score ≥ 80%: "Excellent work!"
   - Test with score 60-79%: "Good attempt!"
   - Test with score 40-59%: "Fair attempt!"
   - Test with score < 40%: "Needs improvement!"

---

## Verification Checklist

### ✅ Difficulty Level Feature
- [ ] Dropdown appears in creation form (Easy, Medium, Hard)
- [ ] Correctly saves to database
- [ ] Displays in teacher's assignment list with color
- [ ] Displays in student's assignment list with color
- [ ] Shows in quiz header with color
- [ ] Shows in programming editor header

### ✅ AI Feedback Feature
- [ ] Appears after grading submission
- [ ] Shows in "Your Grade" section
- [ ] Different messages based on score:
  - [ ] Score ≥ 80%: "Excellent work..."
  - [ ] Score 60-79%: "Good attempt..."
  - [ ] Score 40-59%: "Fair attempt..."
  - [ ] Score < 40%: "Needs improvement..."
- [ ] Works with all assignment types (quiz, programming, essay)

---

## Example Responses

### Create Assignment Response
```json
{
  "message": "Assignment created",
  "assignment": {
    "_id": "123abc",
    "title": "Sum of Two Numbers",
    "type": "programming",
    "difficultyLevel": "easy",          <-- NEW FIELD
    "totalPoints": 100,
    "className": "10",
    "dueDate": "2024-12-31T00:00:00.000Z"
  }
}
```

### Grade Submission Response
```json
{
  "message": "Submission graded",
  "grade": {
    "_id": "456def",
    "totalScore": 85,
    "maxScore": 100,
    "teacherFeedback": "Good work",
    "aiGeneratedFeedback": "Excellent work! You have demonstrated a strong understanding of the concepts. Keep up the great performance!"  <-- GENERATED
  }
}
```

---

## API Requests

### Create Assignment with Difficulty
```bash
curl -X POST http://localhost:5000/api/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Sum of Two Numbers",
    "type": "programming",
    "className": "10",
    "dueDate": "2024-12-31",
    "totalPoints": 100,
    "difficultyLevel": "easy",
    "programmingLanguages": ["python"],
    "question": "Find the sum of two numbers"
  }'
```

### Grade Submission (Triggers AI Feedback)
```bash
curl -X POST http://localhost:5000/api/grades \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "submissionId": "submission_id_here",
    "score": 85
  }'
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Difficulty dropdown not showing | Refresh page or check TeacherDashboard.js is updated |
| AI Feedback not generating | Ensure gradeController imports feedbackGeneratorService |
| Wrong feedback message | Check score calculation - percentage should be score/maxScore * 100 |
| Difficulty not saving to DB | Verify Assignment model has difficultyLevel field |
| Color badges not showing | Check CSS classes match difficulty values |

---

## Files to Review Post-Implementation

1. **Backend Services:** `Backend/services/feedbackGeneratorService.js`
2. **Model Updates:** `Backend/models/Assignment.js`
3. **Controller Updates:** `Backend/controllers/gradeController.js`
4. **Frontend Forms:** `Frontend/src/pages/TeacherDashboard.js`
5. **Display Components:** `Frontend/src/components/ProgrammingEditor.js`, `StudentQuizTaker.js`

---

## Next Steps

After testing:
1. Clear old assignments from DB if needed
2. Run full integration tests
3. Test with real student submissions
4. Verify feedback messages are appropriate
5. Consider adding feedback customization for teachers

Enjoy the new features! 🎓
