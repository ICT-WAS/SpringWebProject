package com.ict.home.notification.service;

import com.ict.home.notification.model.Notification;
import com.ict.home.notification.repository.NotificationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Comparator;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService{

    private final NotificationRepository nr;

    @Override
    public List<Notification> getNotificationList(Long userId) {
        List<Notification> notifications = nr.findByUser_Id(userId);

        return notifications.stream()
                .sorted(Comparator
                        .comparing(Notification::getIsChecked)
                        .thenComparing(Comparator.comparing(Notification::getCreatedAt).reversed()))
                .collect(Collectors.toList());
    }

    @Override
    public boolean checkNotification(Long notificationId) {
        Optional<Notification> notificationOpt = nr.findById(notificationId);

        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();

            notification.setIsChecked(Boolean.TRUE);

            nr.save(notification);

            return true;
        }

        return false;
    }

    @Override
    public boolean deleteNotification(Long notificationId) {
        Optional<Notification> notificationOpt = nr.findById(notificationId);

        if (notificationOpt.isPresent()) {
            nr.delete(notificationOpt.get());
            return true;
        }

        return false;
    }

    @Override
    public Notification findNotificationById(Long notificationId) {
        return nr.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("알림을 찾을 수 없습니다."));
    }
}
