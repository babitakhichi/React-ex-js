const Notification = {
  getNotificationList: {
    url: "/v1.0/notifications",
    method: "GET",
  },
  unreadCount: {
    url: "/v1.0/unread-notification-count",
    method: "GET",
  },
  readNotifications: {
    url: "v1.0/notification/status",
    method: "PUT",
  },
};
export default Notification;
