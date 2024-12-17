package com.ict.home.house.repository;

import com.ict.home.condition.enumeration.AccountType;
import com.ict.home.condition.model.Account;
import com.ict.home.condition.model.Condition01;
import com.ict.home.condition.model.Condition03;
import com.ict.home.condition.model.Family;
import com.ict.home.condition.repository.AccountRepository;
import com.ict.home.house.model.House;
import com.ict.home.house.model.QDetail;
import com.ict.home.house.model.QDetail04;
import com.ict.home.house.utility.NationalPolicyValue;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import static com.ict.home.house.model.QDetail.*;
import static com.ict.home.house.model.QDetail01.*;
import static com.ict.home.house.model.QDetail04.*;
import static com.ict.home.house.model.QHouse.*;


@Repository
@AllArgsConstructor
public class HouseCustomRepositoryImpl implements HouseCustomRepository {

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<House> findFilteredHouseList(List<String> regions,
                                             List<String> houseTypes,
                                             List<String> area,
                                             List<Integer> prices,
                                             List<String> supplies,
                                             List<String> statuses,
                                             List<Account> accounts,
                                             Condition01 condition01,
                                             Condition03 condition03,
                                             List<Family> families,
                                             String orderBy) {
        // 쿼리 생성
        BooleanBuilder builder = new BooleanBuilder();

        // 개인 조건에 맞는 공고: accounts/condition01/condition03/families 필터링
        if (accounts != null && !accounts.isEmpty()) {
            BooleanBuilder myAccountBuilder = new BooleanBuilder();

            Account myAccount = accounts.get(0);
            if (myAccount.getType() == AccountType.SAVINGS_ACCOUNT) {
                // 청약예금 통장일 때
                // 민영주택을 분양 받기 위한 통장
                myAccountBuilder.or(detail01.houseDtlSecd.eq("01"));
            } else if (myAccount.getType() == AccountType.SAVINGS_PLAN) {
                // 청약부금 통장일 때
                // 주거전용면적 85제곱미터 이하 민영주택을 분양받기 위한 통장
                myAccountBuilder.or(detail01.houseDtlSecd.eq("01")
                        .and(detail.suplyAr.lt(85.00)));
            } else if (myAccount.getType() == AccountType.SAVINGS_DEPOSIT) {
                // 청약저축 통장일 때
                // 국민주택을 분양받기 위한 통장
                myAccountBuilder.or(detail01.houseDtlSecd.eq("03"));
            } else if (myAccount.getType() == AccountType.COMBINED_SAVINGS) {
                // 주택청약종합저축 일 때
                // 모두 가능
            }
            builder.and(myAccountBuilder);

            // 지원 가능한 특별공급 방식 판별
            BooleanBuilder supplyByConditionBuilder = new BooleanBuilder();

            // 신혼부부 신청자격
            boolean isNewMarriedCouple = false;

            if (condition01.getMarried() == 1) { // 기혼이라면
                // 결혼 날짜를 가져옴
                LocalDate marriedDate = condition01.getMarriedDate();

                // 현재 날짜를 가져옴
                LocalDate currentDate = LocalDate.now();

                // 결혼 날짜와 현재 날짜 사이의 차이를 계산
                long yearsBetween = ChronoUnit.YEARS.between(marriedDate, currentDate);

                // 7년 이내인지 확인
                if (yearsBetween <= 7) {
                    isNewMarriedCouple = true;
                }

            } else if (condition01.getMarried() == 2) { // 예비 신혼부부라면
                isNewMarriedCouple = true;
            }

            if (isNewMarriedCouple) {
                Family spouse = null;
                List<Family> children = new ArrayList<>();

                int countOfLivingTogetherFamily = 0;

                for (Family family : families) {

                    if (family.getLivingTogether() == 1){
                       countOfLivingTogetherFamily++;
                    }

                    if (family.getRelationship() == 2) {
                        spouse = family;
                    } else if (family.getRelationship() == 9 || family.getRelationship() == 10) {
                        children.add(family);
                    }
                }

                boolean canSupply = false;

                double averageMonthlyIncome140or160 = 0.0;

                if(condition03.getSpouseAverageMonthlyIncome() == null
                        ||
                        condition03.getSpouseAverageMonthlyIncome() == 0){
                    // 배우자의 소득이 없을 경우
                    // 전년도 도시근로자 가구당 월평균 소득의 140%(배우자가 소득이 있는 경우에는 160%) 이하일 것
                    Integer averageMonthlyIncome = // 도시근로자 가구당 월평균 소득 100%
                            NationalPolicyValue.getAverageMonthlyIncome(countOfLivingTogetherFamily);
                    averageMonthlyIncome140or160 = averageMonthlyIncome * 1.4;

                }else{
                    // 배우자의 소득이 있을 경우
                    Integer averageMonthlyIncome = // 도시근로자 가구당 월평균 소득 100%
                            NationalPolicyValue.getAverageMonthlyIncome(countOfLivingTogetherFamily);
                    averageMonthlyIncome140or160 = averageMonthlyIncome * 1.6;
                }
                Integer familyAverageMonthlyIncome = condition03.getFamilyAverageMonthlyIncome();

                if (averageMonthlyIncome140or160 >= familyAverageMonthlyIncome) {
                    canSupply = true;
                }else{
                        /*전년도 도시근로자 가구당 월평균 소득의 140%(배우자가 소득이 있는 경우에는 160%)를 초과하는 경우로서
                        세대원이 소유하는 부동산의 가액의 합계가 「국민건강보험법 시행령」 별표 4 제3호에 따른
                        재산등급 중 29등급에 해당하는 재산금액의 하한과 상한을 산술평균한 금액 이하일 것*/
                    // 29등급 31,300 초과 ~ 34,900 이하
                    // 하한과 상한의 산술평균한 금액 ( 31300 + 34900 ) / 2 = 33100
                    // 즉 세대원이 소유하는 부동산의 가액 합계가 33,100 보다 적을 것
                    if (condition03.getPropertyPrice() < 33100) {
                        canSupply = true;
                    }
                }

                if (canSupply) {
                    supplyByConditionBuilder.or(detail.nwwdsHshldco.gt(0));
                }
            }

            if (condition01.getMarried() != 0 && condition01.getMarried() != 3) {
                Family spouse = null;
                List<Family> children = new ArrayList<>();

                for (Family family : families) {
                    if (family.getRelationship() == 2) {
                        spouse = family;
                    } else if (family.getRelationship() == 9 || family.getRelationship() == 10) {
                        children.add(family);
                    }
                }
            }

        }

        // houseTypes 조건 추가 (국민주택, 민영주택, 무순위)
        if (houseTypes != null && !houseTypes.isEmpty()) {
            BooleanBuilder houseTypeBuilder = new BooleanBuilder();

            // "국민주택"에 대한 조건 추가
            if (houseTypes.contains("국민주택")) {
                houseTypeBuilder.or(house.houseSecd.eq("01")
                        .and(detail01.houseDtlSecd.eq("03")));
            }

            // "민영주택"에 대한 조건 추가
            if (houseTypes.contains("민영주택")) {
                houseTypeBuilder.or(house.houseSecd.eq("01")
                        .and(detail01.houseDtlSecd.eq("01")));
            }

            // "무순위"에 대한 조건 추가
            if (houseTypes.contains("무순위")) {
                houseTypeBuilder.or(house.houseSecd.eq("04"));
            }

            builder.and(houseTypeBuilder);
        }

        // area 조건 추가 (평수별 필터링)
        if (area != null && !area.isEmpty()) {
            BooleanBuilder areaBuilder = new BooleanBuilder();

            if (area.contains("20평 미만")) {
                areaBuilder.or(detail.suplyAr.lt(65.00)); // 면적 65보다 작은 경우
            }

            if (area.contains("20평대")) {
                areaBuilder.or(detail.suplyAr.between(65.00, 99.00)); // 65 이상 99 미만
            }

            if (area.contains("30평대")) {
                areaBuilder.or(detail.suplyAr.between(99.00, 132.00)); // 99 이상 132 미만
            }

            if (area.contains("40평대")) {
                areaBuilder.or(detail.suplyAr.between(132.00, 165.00)); // 132 이상 165 미만
            }

            if (area.contains("50평 이상")) {
                areaBuilder.or(detail.suplyAr.gt(165.00)); // suplyAr가 165 이상인 경우
            }

            builder.and(areaBuilder);
        }

        // prices 조건 추가 (가격별 필터링)
        if (prices != null && prices.size() == 2) {
            BooleanBuilder priceBuilder = new BooleanBuilder();

            Integer start = prices.get(0);
            Integer end = prices.get(1);

            priceBuilder.or(detail.lttotTopAmount.between(start, end)); // 가격 범위

            builder.and(priceBuilder);
        }

        // supplies 조건 추가 (공급 조건 필터링)
        if (supplies != null && !supplies.isEmpty()) {
            BooleanBuilder supplyBuilder = new BooleanBuilder();

            if (supplies.contains("다자녀가구")) {
                supplyBuilder.or(detail.mnychHshldco.gt(0));
            }

            if (supplies.contains("신혼부부")) {
                supplyBuilder.or(detail.nwwdsHshldco.gt(0));
            }

            if (supplies.contains("생애최초")) {
                supplyBuilder.or(detail.lfeFrstHshldco.gt(0));
            }

            if (supplies.contains("노부모부양")) {
                supplyBuilder.or(detail.oldParntsSuportHshldco.gt(0));
            }

            if (supplies.contains("기관추천")) {
                supplyBuilder.or(detail.insttRecomendHshldco.gt(0));
            }

            if (supplies.contains("기타")) {
                supplyBuilder.or(detail.etcHshldco.gt(0));
            }

            if (supplies.contains("이전기관")) {
                supplyBuilder.or(detail.transrInsttEnfsnHshldco.gt(0));
            }

            if (supplies.contains("청년")) {
                supplyBuilder.or(detail.ygmnHshldco.gt(0));
            }

            if (supplies.contains("신생아")) {
                supplyBuilder.or(detail.nwbbHshldco.gt(0));
            }

            builder.and(supplyBuilder);
        }

        // statuses 조건 추가 (접수 상태 필터링)
        if (statuses != null && !statuses.isEmpty()) {
            BooleanBuilder statusBuilder = new BooleanBuilder();

            LocalDate today = LocalDate.now();

            if (statuses.contains("접수전")) {
                // APT의 접수 시작 날짜
                statusBuilder.or(house.houseSecd.eq("01")
                        .and(detail01.rceptBgnde.gt(today)));

                // 무순위의 접수 시작 날짜
                statusBuilder.or(house.houseSecd.eq("04")
                        .and(detail04.subscrptRceptBgnde.gt(today)));
            }

            if (statuses.contains("접수중")) {
                // APT의 접수 시작 날짜 ~ 접수 종료 날짜
                statusBuilder.or(house.houseSecd.eq("01")
                        .and(detail01.rceptBgnde.lt(today))
                        .and(detail01.rceptEndde.gt(today)));

                // 무순위의 접수 시작 날짜 ~ 접수 종료 날짜
                statusBuilder.or(house.houseSecd.eq("04")
                        .and(detail04.subscrptRceptBgnde.lt(today))
                        .and(detail04.subscrptRceptEndde.gt(today)));
            }

            if (statuses.contains("접수마감")) {
                // APT의 접수 종료 날짜 ~
                statusBuilder.or(house.houseSecd.eq("01")
                        .and(detail01.rceptEndde.lt(today)));

                // 무순위의 접수 종료 날짜 ~
                statusBuilder.or(house.houseSecd.eq("04")
                        .and(detail04.subscrptRceptEndde.lt(today)));
            }

            builder.and(statusBuilder);
        }

        JPAQuery<House> query = jpaQueryFactory.select(house)
                .from(house)
                .leftJoin(detail01).on(house.houseId.eq(detail01.house.houseId))  // house와 detail01 테이블을 id 값으로 조인
                .leftJoin(detail).on(house.houseId.eq(detail.house.houseId)) // house와 detail 테이블을 id 값으로 조인
                .leftJoin(detail04).on(house.houseId.eq(detail04.house.houseId)) // house와 detail04 테이블을 id 값으로 조인
                .where(builder);

        if ("최신순".equals(orderBy)) {
            query.orderBy(house.rcritPblancDe.desc()); // rcritPblancDe 기준으로 내림차순 정렬
        }

        List<House> houseList = query.fetch();

        return houseList;
    }
}
