package com.ict.home.notification.service;

import com.ict.home.house.model.Detail01;
import com.ict.home.house.model.Detail04;
import com.ict.home.house.model.House;
import com.ict.home.house.repository.Detail01Repository;
import com.ict.home.house.repository.Detail04Repository;
import com.ict.home.interest.model.Interest;
import com.ict.home.interest.repository.InterestRepository;
import com.ict.home.notification.enumeration.NotificationType;
import com.ict.home.notification.model.Notification;
import com.ict.home.notification.repository.NotificationRepository;
import com.ict.home.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService{

    private final NotificationRepository nr;

    private final InterestRepository ir;

    private final Detail01Repository d01r;

    private final Detail04Repository d04r;

    @Scheduled(cron = "00 30 9 * * ?")
    public void sendNotificationByInterest() {
        List<Interest> interestList = ir.findAll();

        // 모든 관심 공고 리스트
        for (Interest interest : interestList) {
            House house = interest.getHouse();
            User user = interest.getUser();

            List<String> messageList = new ArrayList<>();
            // 당첨자 발표일 이라면
            if (house.getPrzwnerPresnatnDe().isEqual(LocalDate.now())) {
                String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 당첨자 발표일 입니다. ";
                messageList.add(message);
            }

            // 무순위 청약 공고라면
            if (house.getHouseSecd().equals("04")) {
                Optional<Detail04> byHouseHouseId = d04r.findByHouse_HouseId(house.getHouseId());
                byHouseHouseId.ifPresent(detail -> {
                    Detail04 detail04 = detail;

                    // 일반공급접수 시작일이 오늘이라면
                    if (detail04.getSubscrptRceptBgnde().isEqual(LocalDate.now())) {
                        String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 청약 접수가 시작되었습니다.";
                        messageList.add(message);

                    }

                    // 일반공급접수 종료일이 내일이라면
                    if (ChronoUnit.DAYS.between(LocalDate.now(), detail04.getSubscrptRceptEndde()) == 1) {
                        String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 청약 접수 종료가 하루 남았습니다.";
                        messageList.add(message);

                    }
                });

            } else if (house.getHouseSecd().equals("01")) {
                Optional<Detail01> byHouseHouseId = d01r.findByHouse_HouseId(house.getHouseId());
                byHouseHouseId.ifPresent(detail -> {
                    Detail01 detail01 = detail;

                    if (detail01.getRceptBgnde().isEqual(LocalDate.now())) {
                        String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 청약 접수가 시작되었습니다.";
                        messageList.add(message);
                    }

                    if (ChronoUnit.DAYS.between(LocalDate.now(), detail01.getRceptEndde()) == 1) {
                        String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 청약 접수가 하루 남았습니다.";
                        messageList.add(message);
                    }

                    if (detail01.getSpsplyRceptBgnde() != null && detail01.getSpsplyRceptBgnde().isEqual(LocalDate.now())) {
                        String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 특별 공급 접수가 시작되었습니다.";
                        messageList.add(message);
                    }

                    if (detail01.getSpsplyRceptEndde() != null && ChronoUnit.DAYS.between(LocalDate.now(), detail01.getSpsplyRceptEndde()) == 1) {
                        String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 특별 공급 접수가 하루 남았습니다.";
                        messageList.add(message);
                    }

                    if (detail01.getGnrlRnk1CrspareaRcptde() != null && detail01.getGnrlRnk1CrspareaRcptde().isEqual(LocalDate.now())) {
                        String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 1순위 해당지역 접수가 시작되었습니다.";
                        messageList.add(message);
                    }

                    if (detail01.getGnrlRnk1CrspareaEndde() != null && ChronoUnit.DAYS.between(LocalDate.now(), detail01.getGnrlRnk1CrspareaEndde()) == 1) {
                        String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 1순위 해당지역 접수가 하루 남았습니다.";
                        messageList.add(message);
                    }

                    if (detail01.getGnrlRnk1EtcGgRcptde() != null && detail01.getGnrlRnk1EtcGgRcptde().isEqual(LocalDate.now())) {
                        String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 1순위 경기지역 접수가 시작되었습니다.";
                        messageList.add(message);
                    }

                    if (detail01.getGnrlRnk1EtcGgEndde() != null && ChronoUnit.DAYS.between(LocalDate.now(), detail01.getGnrlRnk1EtcGgEndde()) == 1) {
                        String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 1순위 경기지역 접수가 하루 남았습니다.";
                        messageList.add(message);
                    }

                    if (detail01.getGnrlRnk1EtcAreaRcptde() != null && detail01.getGnrlRnk1EtcAreaRcptde().isEqual(LocalDate.now())) {
                        String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 1순위 기타지역 접수가 시작되었습니다.";
                        messageList.add(message);
                    }

                    if (detail01.getGnrlRnk1EtcAreaEndde() != null && ChronoUnit.DAYS.between(LocalDate.now(), detail01.getGnrlRnk1EtcAreaEndde()) == 1) {
                        String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 1순위 기타지역 접수가 하루 남았습니다.";
                        messageList.add(message);
                    }

                    if (detail01.getGnrlRnk2CrspareaRcptde() != null && detail01.getGnrlRnk2CrspareaRcptde().isEqual(LocalDate.now())) {
                        String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 2순위 해당지역 접수가 시작되었습니다.";
                        messageList.add(message);
                    }

                    if (detail01.getGnrlRnk2CrspareaEndde() != null && ChronoUnit.DAYS.between(LocalDate.now(), detail01.getGnrlRnk2CrspareaEndde()) == 1) {
                        String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 2순위 해당지역 접수가 하루 남았습니다.";
                        messageList.add(message);
                    }

                    if (detail01.getGnrlRnk2EtcGgRcptde() != null && detail01.getGnrlRnk2EtcGgRcptde().isEqual(LocalDate.now())) {
                        String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 2순위 경기지역 접수가 시작되었습니다.";
                        messageList.add(message);
                    }

                    if (detail01.getGnrlRnk2EtcGgEndde() != null && ChronoUnit.DAYS.between(LocalDate.now(), detail01.getGnrlRnk2EtcGgEndde()) == 1) {
                        String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 2순위 경기지역 접수가 하루 남았습니다.";
                        messageList.add(message);
                    }

                    if (detail01.getGnrlRnk2EtcAreaRcptde().isEqual(LocalDate.now())) {
                        String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 2순위 기타지역 접수가 시작되었습니다.";
                        messageList.add(message);
                    }

                    if (detail01.getGnrlRnk2EtcAreaEndde() != null && ChronoUnit.DAYS.between(LocalDate.now(), detail01.getGnrlRnk2EtcAreaEndde()) == 1) {
                        String message = "관심 공고로 등록한 \"" + house.getHouseNm() + "\" 공고의 2순위 기타지역 접수가 하루 남았습니다.";
                        messageList.add(message);
                    }



                });
            }


            for (String message : messageList) {
                Notification notification = new Notification();
                notification.setHouse(house);
                notification.setType(NotificationType.ABOUT_ANNOUNCEMENT);
                notification.setUser(user);
                notification.setMessage(message);
                notification.setCreatedAt(LocalDateTime.now());
                nr.save(notification);
            }
        }
    }

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

        notificationOpt.ifPresent(nr::delete);

        return true;
    }

    @Override
    public Notification findNotificationById(Long notificationId) {
        return nr.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("알림을 찾을 수 없습니다."));
    }
}
