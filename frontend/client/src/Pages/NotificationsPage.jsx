import { useContext } from "react";
import { AppContext } from '../AppContext/ContextProvider';
import Header from "../components/Header";

const NotificationsPage = () => {
  const { systemNotifications } = useContext(AppContext);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-r from-teal-100 to-violet-100 p-8">
        <div className="bg-white shadow-md rounded-lg p-6 mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Notifications</h2>
          <div className="space-y-4">
            {Array.isArray(systemNotifications) && systemNotifications.length > 0 ? (
              systemNotifications.map((notification) => {
                const NotificationIcon = notification.icon;
                return (
                  <div 
                    key={notification.id}
                    className={`${getPriorityColor(notification.priority)} p-4 rounded-lg border flex items-start`}
                  >
                    {NotificationIcon && <NotificationIcon className="w-6 h-6 mt-1 mr-4 text-gray-600" />}
                    <div>
                      <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <span className="text-sm text-gray-500 mt-2 block">{notification.date}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600 text-center">No notifications to display</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;