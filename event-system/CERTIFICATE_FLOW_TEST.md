# Certificate Auto-Generation Flow Test

## 🎯 Test Objective
Verify that when a user submits a form, a certificate is automatically generated and sent to their email.

## 📋 Test Steps

### 1. Prerequisites
- ✅ Backend server running on port 5000
- ✅ Frontend server running on port 5173
- ✅ MongoDB running
- ✅ Email service configured (SMTP settings in .env)

### 2. Create a Form with Certificate
1. **Login as Admin** → Navigate to `/forms`
2. **Create Form** → Use SurveyBuilder to create a form with:
   - Title: "Event Feedback Form"
   - Add email question: "What is your email address?"
   - Add other questions (name, rating, etc.)
3. **Publish Form** → Save the form

### 3. Create Certificate Template
1. **Navigate to Certificates** → `/certificates`
2. **Create Certificate** → Link to the form created above
3. **Upload Template** → Upload a PDF certificate template
4. **Enable Auto-Send** → Set `autoSend: true`
5. **Configure Email Template** → Set email subject and body

### 4. Test Form Submission
1. **Get Form Link** → Copy the form URL (e.g., `/feedback/:formId`)
2. **Open Form** → Navigate to the form URL in a new tab/incognito
3. **Fill Form** → Complete all questions including email
4. **Submit Form** → Click submit button

### 5. Verify Certificate Generation
1. **Check Console Logs** → Backend should show:
   ```
   Auto-generating certificate for form: [formId]
   Certificate generated successfully
   Email sent to: [user-email]
   ```
2. **Check Email** → User should receive certificate PDF attachment
3. **Check Database** → Response should have `cert.sent: true`

## 🔍 Expected Behavior

### Backend Flow (formRoutes.js:126-161)
```javascript
// Auto-generate and send certificate if enabled for this form
try {
  const certificate = await Certificate.findOne({ formId: form._id, isActive: true });
  if (certificate?.autoSend) {
    // Generate PDF certificate
    const pdfBuffer = await certificateService.generateCertificate({
      certificateId: certificate._id,
      responseId: response._id,
      data: response.answers
    });

    // Find recipient email from form answers
    let recipientEmail = req.user?.email;
    if (!recipientEmail && Array.isArray(response.answers)) {
      const emailAns = response.answers.find(a => 
        a.type === 'email' || a.qId?.toLowerCase().includes('email')
      );
      if (emailAns?.text) recipientEmail = emailAns.text;
      if (emailAns?.val && typeof emailAns.val === 'string') recipientEmail = emailAns.val;
    }

    // Send certificate via email
    if (recipientEmail) {
      const sendResult = await certificateService.sendCertificate({
        certificateId: certificate._id,
        responseId: response._id,
        recipientEmail,
        pdfBuffer
      });

      if (sendResult.sent) {
        response.cert = { sent: true, at: new Date() };
        await response.save();
      }
    }
  }
} catch (autoErr) {
  console.error('Auto-send certificate error:', autoErr);
}
```

### Frontend Flow (FeedbackForm.jsx:24-31)
```javascript
const handleComplete = async (data) => {
  try {
    await submitFeedback(formId, data.data);
    setSubmitted(true);
  } catch {
    setToast('Submission failed');
  }
};
```

### API Call (feedback.js:4-15)
```javascript
export async function submitFeedback(formId, data) {
  const res = await fetch(`${API_BASE}/forms/${formId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      answers: data,
      time: Date.now()
    }),
  });
  if (!res.ok) throw new Error('Failed to submit feedback');
  return res.json();
}
```

## ✅ Success Criteria

1. **Form Submission** → Form submits successfully
2. **Certificate Generation** → PDF certificate is generated
3. **Email Delivery** → Certificate is sent to user's email
4. **Database Update** → Response record shows `cert.sent: true`
5. **User Feedback** → User sees "Your certificate will be sent via email" message

## 🚨 Troubleshooting

### Common Issues:
1. **Email not sent** → Check SMTP configuration in .env
2. **Certificate not generated** → Check if certificate template exists and is active
3. **Form submission fails** → Check API endpoint and data format
4. **Email not found** → Ensure form has email question with proper field mapping

### Debug Commands:
```bash
# Check backend logs
cd backend && npm start

# Check frontend console
# Open browser dev tools → Console tab

# Check MongoDB
# Connect to MongoDB and check responses collection
```

## 📧 Email Configuration Required

Add to backend `.env` file:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Event System
```

## 🎉 Expected Result

When a user completes and submits a form:
1. ✅ Form data is saved to database
2. ✅ Certificate PDF is automatically generated
3. ✅ Certificate is emailed to the user
4. ✅ User receives confirmation message
5. ✅ Admin can track sent certificates in dashboard

This flow ensures seamless certificate delivery without manual intervention! 🚀

