import { Router } from 'express';
import { AuthRoutes } from '../../modules/Auth/auth.routes';
import { UserRoutes } from '../../modules/User/user.routes';
import { PackageRoutes } from '../../modules/Package/package.routes';
import { EventRoutes } from '../../modules/Event/event.routes';
import { BlogRoutes } from '../../modules/Blog/blog,routes';
import privacyPolicyRouter from '../../modules/PrivacyPolicy/privacyPolicy.routes';
import termsRouter from '../../modules/Terms/terms.route';
import aboutRouter from '../../modules/about/about.route';
import refundRouter from '../../modules/refundPolicy/refund.route';
import { FaqRoutes } from '../../modules/FAQ/faq.routes';
import { BookingRoutes } from '../../modules/booking/booking.routes';
import { ContactRoutes } from '../../modules/ContactUs/contact.route';
import { TransferRoutes } from '../../modules/transferOption/transferOption.routes';
import { ActivityRoutes } from '../../modules/activities/activities.route';



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
    path: '/activity',
    route:ActivityRoutes
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
  {
    path: '/refund',
    route:refundRouter
  },
  {
    path: '/faq',
    route:FaqRoutes
  },
  {
    path: '/booking',
    route:BookingRoutes
  },
  {
    path: '/contact',
    route:ContactRoutes
  },
  {
    path: '/transferOption',
    route:TransferRoutes
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
