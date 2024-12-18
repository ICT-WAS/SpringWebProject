package com.ict.home.notification.service;

import com.ict.home.notification.model.Notification;

import java.util.List;

public interface NotificationService {
    List<Notification> getNotificationList(Long userId);

    boolean checkNotification(Long notificationId);

    boolean deleteNotification(Long notificationId);

    Notification findNotificationById(Long notificationId);
}
