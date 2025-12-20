import express from 'express';
import tripRoutes from './tripRoutes';
import expenseRoutes from './expenseRoutes';
import authRoutes from './authRoutes';
import invitationRoutes from './invitationRoutes';
import userRoutes from './userRoutes';
import planRoutes from './planRoutes';
import flightRoutes from './flightRoutes';
import accommodationRoutes from './accommodationRoutes';

const router = express.Router();

// Podstawowa trasa API
router.get('/', (req, res) => {
  res.json({
    message: 'Travel Mate API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      trips: '/api/trips',
      expenses: '/api/expenses',
      invitations: '/api/invitations',
      plans: '/api/plans',
      accommodations: '/api/accommodations',
      activities: '/api/activities',
      flights: '/api/flights',
      budget: '/api/budget',
    },
  });
});

router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);
router.use('/expenses', expenseRoutes);
router.use('/invitations', invitationRoutes);
router.use('/users', userRoutes);
router.use('/plans', planRoutes);
router.use('/flights', flightRoutes);
router.use('/accommodations', accommodationRoutes);

// // Przykładowe trasy (do rozwinięcia)
// router.get('/test-firestore', async (req, res) => {
//   try {
//     // Import funkcji Firebase (tylko gdy potrzebne)
//     const { firestoreHelpers } = await import('../config/firebase');

//     // Test dodawania dokumentu
//     const testData = {
//       name: 'Test Document',
//       createdAt: new Date().toISOString(),
//       type: 'test'
//     };

//     const docId = await firestoreHelpers.addDocument('test', testData);

//     res.json({
//       success: true,
//       message: 'Firestore test successful',
//       documentId: docId,
//       data: testData
//     });
//   } catch (error) {
//     console.error('Firestore test error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Firestore test failed',
//       error: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

export default router;
