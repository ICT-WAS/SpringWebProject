package com.ict.home.house.utility;

public class PostalCodeRange {
    String region1;
    String region2;
    int start;
    int end;

    public PostalCodeRange(String region1, String region2, int start, int end) {
        this.region1 = region1;
        this.region2 = region2;
        this.start = start;
        this.end = end;
    }

    // 우편번호가 이 범위에 포함되는지 확인하는 메서드
    public boolean isWithinRange(int postalCode) {
        return postalCode >= start && postalCode <= end;
    }
}

