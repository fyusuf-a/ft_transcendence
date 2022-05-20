export default function auth({ next, router }: { next: any; router: any }) {
  // check if user is authenticated
  const authenticated = false;
  if (!authenticated) {
    console.log("not authenticated");
    return router.push({ name: "/login" });
  }
  console.log("authenticated");
  // if not, redirect to login page
  return next();
}
