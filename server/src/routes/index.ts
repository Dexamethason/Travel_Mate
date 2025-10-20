import express from 'express';
import tripRoutes from './tripRoutes';
import expenseRoutes from './expenseRoutes';

const router = express.Router();

// Podstawowa trasa API
router.get('/', (req, res) => {
  res.json({
    message: 'Travel Mate API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
      trips: '/api/trips',
      expenses: '/api/expenses',
      accommodations: '/api/accommodations',
      activities: '/api/activities',
      flights: '/api/flights',
      budget: '/api/budget'
    }
  });
});

router.use('/trips', tripRoutes);
router.use('/expenses', expenseRoutes);

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
