import VueRouter from 'vue-router';
import { NavigationGuardNext } from 'vue-router';

export default function auth({
  next,
  router,
}: {
  next: NavigationGuardNext<Vue>;
  router: VueRouter;
}) {
  // check if user is authenticated
  const authenticated = false;
  if (!authenticated) {
    console.log('not authenticated');
    return router.push({ name: '/login' });
  }
  console.log('authenticated');
  // if not, redirect to login page
  return next();
}
