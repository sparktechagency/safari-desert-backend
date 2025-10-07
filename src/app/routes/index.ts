import { Router } from 'express';
import { AuthRoutes } from '../../modules/Auth/auth.routes';
import { UserRoutes } from '../../modules/User/user.routes';
import { PackageRoutes } from '../../modules/Package/package.routes';
import { EventRoutes } from '../../modules/Event/event.routes';
import { BlogRoutes } from '../../modules/Blog/blog,routes';
import privacyPolicyRouter from '../../modules/PrivacyPolicy/privacyPolicy.routes';
import termsRouter from '../../modules/Terms/terms.route';
import aboutRouter from '../../modules/about/about.route';



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
  {
    path: '/blog',
    route:BlogRoutes
  },
  {
    path: '/privacy',
    route:privacyPolicyRouter
  },
  {
    path: '/terms',
    route:termsRouter
  },
  {
    path: '/about',
    route:aboutRouter
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
