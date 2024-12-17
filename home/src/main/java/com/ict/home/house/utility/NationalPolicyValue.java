package com.ict.home.house.utility;

public class NationalPolicyValue {
    // 월평균 소득 등..

    // 1인 가구 월 평균 소득 100%
    public final static Integer AVERAGE_MONTHLY_INCOME_1 = 4179557;

    // 2인 가구 월 평균 소득 100%
    public final static Integer AVERAGE_MONTHLY_INCOME_2 = 5957283;

    // 3인 가구 월 평균 소득 100%
    public final static Integer AVERAGE_MONTHLY_INCOME_3 = 7198649;

    // 4인 가구 월 평균 소득 100%
    public final static Integer AVERAGE_MONTHLY_INCOME_4 = 8248467;

    // 5인 가구 월 평균 소득 100%
    public final static Integer AVERAGE_MONTHLY_INCOME_5 = 8775071;

    // 6인 가구 월 평균 소득 100%
    public final static Integer AVERAGE_MONTHLY_INCOME_6 = 9563282;

    // 7인 가구 월 평균 소득 100%
    public final static Integer AVERAGE_MONTHLY_INCOME_7 = 10351493;

    // 8인 가구 월 평균 소득 100%
    public final static Integer AVERAGE_MONTHLY_INCOME_8 = 11139704;

    public static Integer getAverageMonthlyIncome(int count){
        return switch (count){
            case 1 -> AVERAGE_MONTHLY_INCOME_1;
            case 2 -> AVERAGE_MONTHLY_INCOME_2;
            case 3 -> AVERAGE_MONTHLY_INCOME_3;
            case 4 -> AVERAGE_MONTHLY_INCOME_4;
            case 5 -> AVERAGE_MONTHLY_INCOME_5;
            case 6 -> AVERAGE_MONTHLY_INCOME_6;
            case 7 -> AVERAGE_MONTHLY_INCOME_7;
            case 8 -> AVERAGE_MONTHLY_INCOME_8;
            default -> AVERAGE_MONTHLY_INCOME_1;
        };
    }
}
