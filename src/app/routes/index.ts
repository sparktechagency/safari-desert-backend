import { Router } from 'express';
import { AuthRoutes } from '../../modules/Auth/auth.routes';
import { UserRoutes } from '../../modules/User/user.routes';
import { PackageRoutes } from '../../modules/Package/package.routes';
import { EventRoutes } from '../../modules/Event/event.routes';



const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route:AuthRoutes
  },
  {
    path: '/user',
    route:UserRoutes
  },
  {
    path: '/package',
    route:PackageRoutes
  },
  {
    path: '/event',
    route:EventRoutes
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
