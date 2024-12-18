package com.ict.home.interest.dto;

public class InterestRequest {
    private Long userId;
    private Long houseId;

    // 기본 생성자
    public InterestRequest() {}

    // 생성자
    public InterestRequest(Long userId, Long houseId) {
        this.userId = userId;
        this.houseId = houseId;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getHouseId() {
        return houseId;
    }

    public void setHouseId(Long houseId) {
        this.houseId = houseId;
    }
}
