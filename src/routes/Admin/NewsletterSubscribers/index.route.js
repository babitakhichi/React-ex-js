import { NewsletterSubscribers } from "../../../pages";
import adminRoutesMap from "../../../routeControl/adminRoutes";

export default function route() {
  return [
    {
      path: adminRoutesMap.NEWSLETTER_SUBSCRIBERS.path,
      private: true,
      name: "Newsletter Subscribers",
      key: adminRoutesMap.NEWSLETTER_SUBSCRIBERS.path,
      belongsToSidebar: true,
      icon: adminRoutesMap.NEWSLETTER_SUBSCRIBERS.icon,
      element: <NewsletterSubscribers />,
    },
  ];
}
