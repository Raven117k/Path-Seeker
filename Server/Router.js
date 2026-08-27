const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

// Configure Multer for file uploads (resumes / resources)
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => cb(null, `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = file.mimetype === 'application/pdf'
      || file.mimetype.startsWith('image/')
      || file.mimetype.startsWith('video/')
      || file.mimetype.startsWith('audio/');
    if (!allowed) {
      return cb(new Error('Only PDF, image, video, or audio uploads are allowed'));
    }
    cb(null, true);
  }
});
const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype);
    if (!allowed) return cb(new Error('Only PDF, DOC, or DOCX uploads are allowed'));
    cb(null, true);
  }
});

// Controllers
const userCtrl = require('./controller/userController');
const careerCtrl = require('./controller/careerController');
const quizCtrl = require('./controller/quizController');
const mediaCtrl = require('./controller/multimediaController');
const storyCtrl = require('./controller/storyController');
const resourceCtrl = require('./controller/resourceController');
const feedbackCtrl = require('./controller/feedbackController');
const bookmarkCtrl = require('./controller/bookmarkController');
const adminCtrl = require('./controller/adminController');
const aiCtrl = require('./controller/aiController');
const uploadCtrl = require('./controller/uploadController');

// Middleware
const { verifyToken, isAdmin } = require('./middleware/authMiddleware');

// 0. Personalized AI Career Copilot
router.get('/ai/history', verifyToken, aiCtrl.getHistory);
router.post('/ai/chat', verifyToken, aiCtrl.chat);

// 1. User & Auth Routes
router.post('/sign-up', userCtrl.Registration);
router.post('/sign-in', userCtrl.login);
router.post('/forgot-password', userCtrl.forgotPassword);
router.post('/reset-password', userCtrl.resetPasswordWithOtp);
router.get('/profile', verifyToken, userCtrl.getProfile);
router.put('/profile', verifyToken, userCtrl.updateProfile);
router.post('/upload-resume', verifyToken, uploadResume.single('resume'), userCtrl.uploadResume);
router.post('/admin/upload', verifyToken, isAdmin, upload.single('file'), uploadCtrl.uploadAsset);

// 2. Career Bank Routes
router.get('/careers', careerCtrl.getAllCareers);
router.get('/careers/suggestions', careerCtrl.getCareerSuggestions);
router.get('/careers/:id', careerCtrl.getCareerById);
router.post('/careers', verifyToken, isAdmin, careerCtrl.createCareer);
router.put('/careers/:id', verifyToken, isAdmin, careerCtrl.updateCareer);
router.delete('/careers/:id', verifyToken, isAdmin, careerCtrl.deleteCareer);

// 3. AI Interest Quiz Routes
router.get('/quiz/questions', quizCtrl.getQuestions);
router.post('/quiz/submit', verifyToken, quizCtrl.submitQuiz);
router.get('/quiz/history', verifyToken, quizCtrl.getUserQuizHistory);
router.post('/quiz/questions', verifyToken, isAdmin, quizCtrl.createQuestion);
router.put('/quiz/questions/:id', verifyToken, isAdmin, quizCtrl.updateQuestion);
router.delete('/quiz/questions/:id', verifyToken, isAdmin, quizCtrl.deleteQuestion);

// 4. Multimedia Center Routes
router.get('/multimedia', mediaCtrl.getAllMultimedia);
router.get('/multimedia/:id', mediaCtrl.getMultimediaById);
router.post('/multimedia/:id/rate', verifyToken, mediaCtrl.rateMultimedia);
router.post('/multimedia', verifyToken, isAdmin, mediaCtrl.createMultimedia);
router.put('/multimedia/:id', verifyToken, isAdmin, mediaCtrl.updateMultimedia);
router.delete('/multimedia/:id', verifyToken, isAdmin, mediaCtrl.deleteMultimedia);

// 5. Success Stories Routes
router.get('/stories', storyCtrl.getApprovedStories);
router.post('/stories', verifyToken, storyCtrl.submitStory);
router.get('/admin/stories', verifyToken, isAdmin, storyCtrl.getAllStoriesAdmin);
router.put('/admin/stories/:id', verifyToken, isAdmin, storyCtrl.toggleApproveStory);
router.delete('/admin/stories/:id', verifyToken, isAdmin, storyCtrl.deleteStory);

// 6. Document Resource Library Routes
router.get('/resources', resourceCtrl.getAllResources);
router.post('/resources/:id/download', resourceCtrl.trackDownload);
router.post('/resources', verifyToken, isAdmin, resourceCtrl.createResource);
router.put('/resources/:id', verifyToken, isAdmin, resourceCtrl.updateResource);
router.delete('/resources/:id', verifyToken, isAdmin, resourceCtrl.deleteResource);

// 7. Feedback & Analytics Routes
router.post('/feedback', verifyToken, feedbackCtrl.submitFeedback);
router.get('/feedback/my', verifyToken, feedbackCtrl.getUserFeedbacks);
router.get('/admin/feedback', verifyToken, isAdmin, feedbackCtrl.getAllFeedbacksAdmin);
router.put('/admin/feedback/:id/respond', verifyToken, isAdmin, feedbackCtrl.respondToFeedback);

// 8. Bookmarks & Sticky Notes & Notifications
router.get('/bookmarks', verifyToken, bookmarkCtrl.getBookmarks);
router.post('/bookmarks', verifyToken, bookmarkCtrl.addBookmark);
router.put('/bookmarks/:id/note', verifyToken, bookmarkCtrl.updateStickyNote);
router.delete('/bookmarks/:id', verifyToken, bookmarkCtrl.removeBookmark);
router.get('/notifications', verifyToken, bookmarkCtrl.getUserNotifications);
router.put('/notifications/read', verifyToken, bookmarkCtrl.markNotificationRead);

// 9. Admin Control Panel Routes
router.get('/admin/dashboard-stats', verifyToken, isAdmin, adminCtrl.getAdminDashboardStats);
router.get('/admin/users', verifyToken, isAdmin, adminCtrl.getAllUsersAdmin);
router.put('/admin/users/:id', verifyToken, isAdmin, adminCtrl.updateUserRoleOrStatus);
router.post('/admin/broadcast', verifyToken, isAdmin, adminCtrl.broadcastAnnouncement);

module.exports = router;