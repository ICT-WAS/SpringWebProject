package com.ict.home.notification.controller;

import com.ict.home.notification.model.Notification;
import com.ict.home.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService ns;

    @GetMapping("/list/{userId}")
    @Operation(summary = "알람 조회", description = "유저의 알람을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "알람 목록 조회 성공",
                    content = @Content(schema = @Schema(implementation = Notification.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    public ResponseEntity<?> getNotificationList(@PathVariable Long userId){

        List<Notification> notifications = ns.getNotificationList(userId);

        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{notificationId}")
    @Operation(summary = "알람 확인", description = "알람을 확인합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "알람 확인 성공",
                    content = @Content(schema = @Schema(implementation = Notification.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    public ResponseEntity<?> checkNotification(@PathVariable Long notificationId){

        boolean isUpdated = ns.checkNotification(notificationId);

        if (isUpdated) {
            // 수정 성공 시, 200 OK와 수정된 알림 객체를 반환
            Notification updatedNotification = ns.findNotificationById(notificationId);
            return ResponseEntity.ok(updatedNotification);
        } else {
            // 수정 실패 시, 404 Not Found로 알림이 존재하지 않음을 알려줌
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("알림을 찾을 수 없습니다.");
        }
    }

    @DeleteMapping("/{notificationId}")
    @Operation(summary = "알람 삭제", description = "알람을 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "알람 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    public ResponseEntity<?> deleteNotification(@PathVariable Long notificationId) {

        boolean isDeleted = ns.deleteNotification(notificationId);

        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("알림을 찾을 수 없습니다.");
        }

    }

}
