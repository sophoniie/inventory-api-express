import { Router } from 'express';

const router: Router = Router();

// API version 1 routes
router.get('/', (req, res) => {
  res.json({
    message: 'Inventory API v1.0.0',
    version: '1.0.0',
    docs: '/api/v1/docs'
  });
});

// Placeholder for future routes
// router.use('/products', productRoutes);
// router.use('/categories', categoryRoutes);
// router.use('/suppliers', supplierRoutes);

export default router;
