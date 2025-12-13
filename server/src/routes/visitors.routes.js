import router from 'express';
import {addVisitorCount, getVisitorCount} from '../controllers/visitors.controller.js';

const visitorRouter = router.Router();

visitorRouter.route('/').post(addVisitorCount);
visitorRouter.route('/').get(getVisitorCount);

export default visitorRouter;