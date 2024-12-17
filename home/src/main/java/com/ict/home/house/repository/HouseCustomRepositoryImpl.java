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
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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


            /* ===================================
             통장 종류 필터링
            =================================== */
            BooleanBuilder myAccountBuilder = new BooleanBuilder();

            Account myAccount = accounts.get(0);
            if (myAccount.getType() == AccountType.SAVINGS_ACCOUNT) {
                // 청약예금 통장일 때
                // 민영주택을 분양 받기 위한 통장
                myAccountBuilder.or(detail01.houseDtlSecd.eq("01"));
                myAccountBuilder.or(house.houseSecd.eq("04"));
            } else if (myAccount.getType() == AccountType.SAVINGS_PLAN) {
                // 청약부금 통장일 때
                // 주거전용면적 85제곱미터 이하 민영주택을 분양받기 위한 통장
                myAccountBuilder.or(detail01.houseDtlSecd.eq("01")
                        .and(detail.suplyAr.lt(85.00)));
                myAccountBuilder.or(house.houseSecd.eq("04"));
            } else if (myAccount.getType() == AccountType.SAVINGS_DEPOSIT) {
                // 청약저축 통장일 때
                // 국민주택을 분양받기 위한 통장
                myAccountBuilder.or(detail01.houseDtlSecd.eq("03"));
                myAccountBuilder.or(house.houseSecd.eq("04"));
            } else if (myAccount.getType() == AccountType.COMBINED_SAVINGS) {
                // 주택청약종합저축 일 때
                // 모두 가능
                myAccountBuilder.or(house.houseSecd.eq("04"));
                myAccountBuilder.or(house.houseSecd.eq("01"));
            }

            builder.and(myAccountBuilder);

            /* ===================================
             특별공급 지원 자격 필터링
            =================================== */
            BooleanBuilder supplyByConditionBuilder = new BooleanBuilder();

            // 신혼부부 특별공급
            if (isNewlyweds(accounts, condition01, condition03, families)) {
                supplyByConditionBuilder.or(detail.nwwdsHshldco.gt(0));
            }
            // 신혼부부 특별공급 종료

            // 다자녀가구 특별공급
            if (isMultiChildFamily(accounts, condition01, condition03, families)){
                // 국민주택 특별공급: 주택청약종합저축에 가입하여 6개월이 지나고 매월 약정납입일에 월납입금을 6회 이상 납입하였을 것
                if(myAccount.getPaymentCount()>=6 && isSixMonthsAgo(myAccount.getCreatedAt())) {
                    supplyByConditionBuilder.or(
                            detail.mnychHshldco.gt(0)
                            .and(detail01.houseDtlSecd.eq("03"))
                    );
                }

                // 민영주택 특별공급: 주택청약종합저축에 가입하여 6개월이 지나고 다음의 예치기준금액에 상당하는 금액을 납입하였을 것
                if(myAccount.getPaymentCount()>=6){
                    Integer totalAmount = myAccount.getTotalAmount();

                    if (totalAmount >= 200) {
                        // 200 이상이면 특별시 및 광역시 제외지역, 85제곱미터 이하 가능
                        supplyByConditionBuilder.or(
                                detail01.houseDtlSecd.eq("01")
                                        .and(detail.mnychHshldco.gt(0))
                                        .and(detail.suplyAr.lt(85.00))
                                        .and(detail01.subscrptAreaCodeNm.notIn("서울", "대전", "대구", "울산", "광주", "인천", "부산"))
                        );
                    }

                    if (totalAmount >= 250) {
                        // 250 이상이면 부산을 제외한 광역시, 85제곱미터 이하 가능
                        supplyByConditionBuilder.or(
                                detail01.houseDtlSecd.eq("01")
                                        .and(detail.mnychHshldco.gt(0))
                                        .and(detail.suplyAr.lt(85.00))
                                        .and(detail01.subscrptAreaCodeNm.in("대전", "대구", "울산", "광주", "인천"))
                        );
                    }

                    if (totalAmount >= 300) {
                        // 300 이상이면 특별시 및 부산광역시, 85제곱미터 이하 가능
                        // 300 이상이면 특별시 및 광역시 제외지역, 102제곱미터 이하 가능
                        supplyByConditionBuilder.or(
                                detail01.houseDtlSecd.eq("01")
                                        .and(detail.mnychHshldco.gt(0))
                                        .and(detail.suplyAr.lt(85.00))
                                        .and(detail01.subscrptAreaCodeNm.in("서울", "부산"))
                        );

                        supplyByConditionBuilder.or(
                                detail01.houseDtlSecd.eq("01")
                                        .and(detail.mnychHshldco.gt(0))
                                        .and(detail.suplyAr.lt(102.00))
                                        .and(detail01.subscrptAreaCodeNm.notIn("서울", "대전", "대구", "울산", "광주", "인천", "부산"))
                        );
                    }

                    if (totalAmount >= 400) {
                        // 400 이상이면 부산을 제외한 광역시, 102제곱미터 이하 가능
                        // 400 이상이면 특별시 및 광역시 제외지역, 135제곱미터 이하 가능
                        supplyByConditionBuilder.or(
                                detail01.houseDtlSecd.eq("01")
                                        .and(detail.mnychHshldco.gt(0))
                                        .and(detail.suplyAr.lt(102.00))
                                        .and(detail01.subscrptAreaCodeNm.in("대전", "대구", "울산", "광주", "인천"))
                        );

                        supplyByConditionBuilder.or(
                                detail01.houseDtlSecd.eq("01")
                                        .and(detail.mnychHshldco.gt(0))
                                        .and(detail.suplyAr.lt(135.00))
                                        .and(detail01.subscrptAreaCodeNm.notIn("서울", "대전", "대구", "울산", "광주", "인천", "부산"))
                        );
                    }

                    if (totalAmount >= 500) {
                        // 500 이상이면 특별시 및 광역시 제외지역, 모든 면적 가능
                        supplyByConditionBuilder.or(
                                detail01.houseDtlSecd.eq("01")
                                        .and(detail.mnychHshldco.gt(0))
                                        .and(detail01.subscrptAreaCodeNm.notIn("서울", "대전", "대구", "울산", "광주", "인천", "부산"))
                        );
                    }

                    if (totalAmount >= 600) {
                        // 600 이상이면 특별시 및 부산광역시, 102제곱미터 이하 가능
                        supplyByConditionBuilder.or(
                                detail01.houseDtlSecd.eq("01")
                                        .and(detail.mnychHshldco.gt(0))
                                        .and(detail.suplyAr.lt(102.00))
                                        .and(detail01.subscrptAreaCodeNm.in("서울", "부산"))
                        );
                    }

                    if (totalAmount >= 700) {
                        // 700 이상이면 부산을 제외한 광역시, 135제곱미터 이하 가능
                        supplyByConditionBuilder.or(
                                detail01.houseDtlSecd.eq("01")
                                        .and(detail.mnychHshldco.gt(0))
                                        .and(detail.suplyAr.lt(135.00))
                                        .and(detail01.subscrptAreaCodeNm.in("대전", "대구", "울산", "광주", "인천"))
                        );
                    }

                    if (totalAmount >= 1000) {
                        // 1000 이상이면 부산을 제외한 광역시, 모든 면적 가능
                        // 1000 이상이면 특별시 및 부산광역시, 135제곱미터 이하 가능
                        supplyByConditionBuilder.or(
                                detail01.houseDtlSecd.eq("01")
                                        .and(detail.mnychHshldco.gt(0))
                                        .and(detail.suplyAr.lt(135.00))
                                        .and(detail01.subscrptAreaCodeNm.in("서울", "부산"))
                        );

                        supplyByConditionBuilder.or(
                                detail01.houseDtlSecd.eq("01")
                                        .and(detail.mnychHshldco.gt(0))
                                        .and(detail01.subscrptAreaCodeNm.in("대전", "대구", "울산", "광주", "인천"))
                        );
                    }

                    if (totalAmount >= 1500) {
                        // 1500 이상이면 모든 지역, 모든 면적 가능
                        supplyByConditionBuilder.or(
                                detail01.houseDtlSecd.eq("01")
                                        .and(detail.mnychHshldco.gt(0))
                        );
                    }
                }

            }
            // 다자녀가구 특별공급 종료

            // 생애최초 특별공급
            if (isFirstTime(accounts, condition01, condition03, families)) {

                // 투기과열지구 1순위라면
                if (isFirstPriorityInSpeculativeHotZone(myAccount, condition01, condition03, families)) {
                    // 국민주택 가능
                    supplyByConditionBuilder.or(
                            detail01.houseDtlSecd.eq("03")
                                    .and(detail.lfeFrstHshldco.gt(0))
                    );

                    // 85제곱미터 이하의 민영주택 가능
                    supplyByConditionBuilder.or(
                            detail01.houseDtlSecd.eq("01")
                                    .and(detail.lfeFrstHshldco.gt(0))
                                    .and(detail.suplyAr.lt(85.00))
                    );
                } else if (isFirstPriorityInGeneralCapitalRegion(myAccount)) {
                  // 일반 수도권 1순위라면
                    // 국민주택 중 투기과열지구 제외
                    supplyByConditionBuilder.or(
                            detail01.houseDtlSecd.eq("03")
                                    .and(detail.lfeFrstHshldco.gt(0))
                                    .and(detail01.specltRdnEarthAt.eq(false))
                    );

                    // 85제곱미터 이하의 민영주택 중 투기과열지구 제외
                    supplyByConditionBuilder.or(
                            detail01.houseDtlSecd.eq("01")
                                    .and(detail.lfeFrstHshldco.gt(0))
                                    .and(detail.suplyAr.lt(85.00))
                                    .and(detail01.specltRdnEarthAt.eq(false))
                    );
                } else if (isFirstPriorityOutsideCapitalRegion(myAccount)) {
                    // 수도권 외 1순위라면
                    // 국민주택 중 수도권 제외
                    supplyByConditionBuilder.or(
                            detail01.houseDtlSecd.eq("03")
                                    .and(detail.lfeFrstHshldco.gt(0))
                                    .and(detail01.subscrptAreaCodeNm.notIn("서울", "인천", "경기"))
                    );

                    // 85제곱미터 이하의 민영주택 중 수도권 제외
                    supplyByConditionBuilder.or(
                            detail01.houseDtlSecd.eq("01")
                                    .and(detail.lfeFrstHshldco.gt(0))
                                    .and(detail.suplyAr.lt(85.00))
                                    .and(detail01.subscrptAreaCodeNm.notIn("서울", "인천", "경기"))
                    );
                }
            }
            // 생애최초 특별공급 종료

            // 노부모부양 특별공급
            if(isGrandParentSupport(myAccount, condition01, condition03, families)){
                // 투기과열지구 1순위라면
                if (isFirstPriorityInSpeculativeHotZone(myAccount, condition01, condition03, families)) {
                    // 국민주택 가능
                    supplyByConditionBuilder.or(
                            detail01.houseDtlSecd.eq("03")
                                    .and(detail.oldParntsSuportHshldco.gt(0))
                    );

                    // 85제곱미터 이하의 민영주택 가능
                    supplyByConditionBuilder.or(
                            detail01.houseDtlSecd.eq("01")
                                    .and(detail.oldParntsSuportHshldco.gt(0))
                                    .and(detail.suplyAr.lt(85.00))
                    );
                } else if (isFirstPriorityInGeneralCapitalRegion(myAccount)) {
                    // 일반 수도권 1순위라면
                    // 국민주택 중 투기과열지구 제외
                    supplyByConditionBuilder.or(
                            detail01.houseDtlSecd.eq("03")
                                    .and(detail.oldParntsSuportHshldco.gt(0))
                                    .and(detail01.specltRdnEarthAt.eq(false))
                    );

                    // 85제곱미터 이하의 민영주택 중 투기과열지구 제외
                    supplyByConditionBuilder.or(
                            detail01.houseDtlSecd.eq("01")
                                    .and(detail.oldParntsSuportHshldco.gt(0))
                                    .and(detail.suplyAr.lt(85.00))
                                    .and(detail01.specltRdnEarthAt.eq(false))
                    );
                } else if (isFirstPriorityOutsideCapitalRegion(myAccount)) {
                    // 수도권 외 1순위라면
                    // 국민주택 중 수도권 제외
                    supplyByConditionBuilder.or(
                            detail01.houseDtlSecd.eq("03")
                                    .and(detail.oldParntsSuportHshldco.gt(0))
                                    .and(detail01.subscrptAreaCodeNm.notIn("서울", "인천", "경기"))
                    );

                    // 85제곱미터 이하의 민영주택 중 수도권 제외
                    supplyByConditionBuilder.or(
                            detail01.houseDtlSecd.eq("01")
                                    .and(detail.oldParntsSuportHshldco.gt(0))
                                    .and(detail.suplyAr.lt(85.00))
                                    .and(detail01.subscrptAreaCodeNm.notIn("서울", "인천", "경기"))
                    );
                }
            }
            // 노부모부양 특별공급 종료

            // 청년 특별공급
            if (isYoungAdult(myAccount, condition01, condition03, families)) {
                // 전용면적 60제곱미터 이하 국민
                supplyByConditionBuilder.or(
                        detail01.houseDtlSecd.eq("03")
                                .and(detail.ygmnHshldco.gt(0))
                                .and(detail.suplyAr.lt(60.00))
                );
            }
            // 청년 특별공급 종료

            // 신생아 특별공급
            if (isNewborn(myAccount, condition01, condition03, families)) {
                supplyByConditionBuilder.or(
                                detail.nwbbHshldco.gt(0)
                );
            }
            // 신생아 특별공급 종료

            builder.and(supplyByConditionBuilder);
        }
        // 개인 조건 필터링 종료

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

    private boolean isNewborn(Account myAccount, Condition01 condition01, Condition03 condition03, List<Family> families) {
        // 신생아 특별공급 신청 자격
        boolean isNewborn = true;
        // isCreatedAtMoreThanTwoYearsAgo() // 2년이 지나면 true

        // 신생아 리스트
        List<Family> newborns = families.stream()
                .filter(family -> (family.getRelationship() == 10)
                        || (family.getRelationship() == 9 && isWithinTwoYears(family.getBirthday())))
                .toList();

        if (newborns.isEmpty()) {
            return false;
        }

        // 무주택 세대 구성원이어야 함
        for (Family family : families) {
            if (family.getHouseCount() != 0) {
                return false;
            }
        }

        if(NationalPolicyValue.getAverageMonthlyIncome(families.size()) * 1.4 < condition03.getFamilyAverageMonthlyIncome()){
            return false;
        }

        if (condition03.getPropertyPrice() != 0) {
            return false;
        }

        if (condition03.getCarPrice() > 3708) {
            return false;
        }

        return isNewborn;
    }

    private boolean isWithinTwoYears(LocalDate birthday) {
        LocalDate currentDate = LocalDate.now();
        long yearsBetween = ChronoUnit.YEARS.between(birthday, currentDate);
        return yearsBetween < 2;
    }

    private boolean isYoungAdult(Account myAccount, Condition01 condition01, Condition03 condition03, List<Family> families) {
        // 청년 특별공급 신청 자격
        boolean isYoungAdult = true;

        // 미혼(이혼) 청년만 가능
        if (condition01.getMarried() == 1 || condition01.getMarried() == 2) {
            return false;
        }

        Family self = families.stream()
                .filter(f -> f.getRelationship() == 1)
                .findFirst()
                .orElse(null);

        if (self == null) {
            return false;
        }

        // 과거 주택을 소유한 적이 없는 사람만 가능
        if(self.getHouseCount()>=1 || self.getHouseSoldDate()!=null){
            return false;
        }

        if (!isSixMonthsAgo(myAccount.getCreatedAt())) {
            return false;
        }

        if (myAccount.getPaymentCount() < 6) {
            return false;
        }

        // 본인의 총 자산 2억 8900만원 이하여야 가능
        if (condition03.getMyAsset() > 28900) {
            return false;
        }

        // 본인의 월 평균 소득이 도시근로자 1인 월평균 소득의 140% 이하여야 가능
        if (NationalPolicyValue.getAverageMonthlyIncome(1) * 1.4 < condition03.getPreviousYearAverageMonthlyIncome()) {
            return false;
        }

        return isYoungAdult;
    }

    private boolean isGrandParentSupport(Account myAccount, Condition01 condition01, Condition03 condition03, List<Family> families) {
        // 노부모부양 특별공급 신청자격
        boolean isGrandParentSupport = true;

        // 세대주가 아니면 안됨
        if (!condition01.getIsHouseHolder()) {
            return false;
        }

        // 직계존속(배우자 포함) 3년 이상 부양
        boolean over3Years = false;
        boolean hasHouse = false;
        for (Family family : families) {
            if (family.getHouseCount() >= 1) {
                hasHouse = true;
            }

            if(
                    family.getRelationship() == 3 || // 어머니
                    family.getRelationship() == 4 || // 아버지
                    family.getRelationship() == 5 || // 할머니
                    family.getRelationship() == 6 || // 할아버지
                    family.getRelationship() == 7 || // 증조할머니
                    family.getRelationship() == 8 || // 증조할아버지
                    family.getRelationship() == 12 || // 배우자의 어머니
                    family.getRelationship() == 13 || // 배우자의 아버지
                    family.getRelationship() == 14 || // 배우자의 할머니
                    family.getRelationship() == 15 || // 배우자의 할아버지
                    family.getRelationship() == 16 || // 배우자의 증조할머니
                    family.getRelationship() == 17 // 배우자의 증조할아버지
            ){
                if (family.getLivingTogetherDate() == 3) {
                    over3Years = true;
                }
            }
        }

        if (!over3Years) {
            return false;
        }

        // 무주택 세대인지 확인
        if (hasHouse) {
            return false;
        }

        Integer averageMonthlyIncome = NationalPolicyValue.getAverageMonthlyIncome(families.size());
        if (averageMonthlyIncome * 1.2 < condition03.getFamilyAverageMonthlyIncome()) {
            return false;
        }

        if (condition03.getPropertyPrice() != 0) {
            return false;
        }

        return isGrandParentSupport;
    }

    private boolean isFirstTime(List<Account> accounts, Condition01 condition01, Condition03 condition03, List<Family> families) {
        // 생애최초 특별공급 신청자격
        boolean isFirstTime = true;

        //  저축액이 600만원 이상
        if (accounts.get(0).getTotalAmount() < 600) {
            return false;
        }

        // 혼인 또는 자녀가 있음
        List<Family> spouseAndChildren = families.stream()
                // 배우자 또는 자녀
                .filter(family -> family.getRelationship() == 2 || family.getRelationship() == 9 || family.getRelationship() == 10)
                .toList();
        if (spouseAndChildren.isEmpty()) {
            return false;
        }

        // 세대원 중 한 사람이라도 주택(분양권등) 구입, 상속, 증여, 신축 등 사유를 불문하고
        // 과거에 한 번이라도 주택(분양권등)을 소유한 사실이 있는 경우는 생애최초 특별공급의 대상이 될 수 없음

        for (Family family : families) {
            if (family.getHouseCount() >= 1 || family.getHouseSoldDate() != null) {
                return false;
            }
        }

        // 5년 이상 소득세를 납부한 자
        if (condition03.getIncomeTaxPaymentPeriod() < 5) {
            return false;
        }

        // 해당 세대의 월평균 소득이 전년도 도시근로자 가구당 월평균 소득의 130퍼센트 이하인 자
        if(NationalPolicyValue.getAverageMonthlyIncome(families.size()) * 1.3 < condition03.getFamilyAverageMonthlyIncome()){
            return false;
        };

        return isFirstTime;
    }

    private boolean isMultiChildFamily(List<Account> accounts, Condition01 condition01, Condition03 condition03, List<Family> families) {
        // 다자녀가구 신청자격
        boolean isMultiChildFamily = false;

        // 미성년자 혹은 태아
        List<Family> minors = families.stream()
                .filter(family -> (family.getRelationship() == 9 && isMinor(family.getBirthday()) && isWithin6Years(family.getBirthday()))
                        || family.getRelationship() == 10)
                .toList();
        isMultiChildFamily = minors.size()>=2;

        return isMultiChildFamily;
    }

    // 미성년자 판단 메소드
    private boolean isMinor(LocalDate birthday) {
        LocalDate today = LocalDate.now();
        int age = Period.between(birthday, today).getYears();
        return age < 18;  // 18세 미만이면 미성년자
    }

    private boolean isNewlyweds(List<Account> accounts, Condition01 condition01, Condition03 condition03, List<Family> families) {
        // 신혼부부 신청자격
        boolean isNewMarriedCouple = false;

        Account myAccount = accounts.get(0);

        if (condition01.getMarried() == 1) {
            // 기혼이라면 혼인신고일 7년 이내

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

        } else if (condition01.getMarried() == 2) {
            // 예비 신혼부부라면
            isNewMarriedCouple = true;
        }

        // 기혼이 아니더라도 6년 이내에 태어난 자녀 또는 태아를 필터링
        List<Family> filteredFamilies = families.stream()
                .filter(family -> (family.getRelationship() == 9 && isWithin6Years(family.getBirthday()))
                        || family.getRelationship() == 10)
                .toList();

        isNewMarriedCouple = !filteredFamilies.isEmpty();

        //통장 조건 가입 6개월 이상 납입 6회 이상
        LocalDate createdAt = myAccount.getCreatedAt();
        isNewMarriedCouple = isSixMonthsAgo(createdAt) && myAccount.getPaymentCount() >= 6;


        if (isNewMarriedCouple) {
            Family spouse = null;
            List<Family> children = new ArrayList<>();

            int countOfLivingTogetherFamily = 0;

            for (Family family : families) {

                if (family.getLivingTogether() == 1) {
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

            Integer averageMonthlyIncome = // 도시근로자 가구당 월평균 소득 100%
                    NationalPolicyValue.getAverageMonthlyIncome(countOfLivingTogetherFamily);

            if (condition03.getSpouseAverageMonthlyIncome() == null
                    ||
                    condition03.getSpouseAverageMonthlyIncome() == 0) {
                // 배우자의 소득이 없을 경우
                // 전년도 도시근로자 가구당 월평균 소득의 130%(배우자가 소득이 있는 경우에는 160%) 이하일 것
                averageMonthlyIncome140or160 = averageMonthlyIncome * 1.3;

            } else {
                // 배우자의 소득이 있을 경우
                averageMonthlyIncome140or160 = averageMonthlyIncome * 1.6;
            }
            Integer familyAverageMonthlyIncome = condition03.getFamilyAverageMonthlyIncome();

            if (averageMonthlyIncome140or160 >= familyAverageMonthlyIncome) {
                canSupply = true;
            } else {
                        /*전년도 도시근로자 가구당 월평균 소득의 130%(배우자가 소득이 있는 경우에는 160%)를 초과하는 경우로서
                        세대원이 소유하는 부동산의 가액의 합계가 「국민건강보험법 시행령」 별표 4 제3호에 따른
                        재산등급 중 29등급에 해당하는 재산금액의 하한과 상한을 산술평균한 금액 이하일 것*/
                // 29등급 31,300 초과 ~ 34,900 이하
                // 하한과 상한의 산술평균한 금액 ( 31300 + 34900 ) / 2 = 33100
                // 즉 세대원이 소유하는 부동산의 가액 합계가 33,100 보다 적을 것
                if (condition03.getPropertyPrice() < 33100) {
                    canSupply = true;
                }
            }

            return canSupply;
        }else{
            return false;
        }

    }

    private boolean isCreatedAtMoreThanTwoYearsAgo(LocalDate createdAt) {
        LocalDate currentDate = LocalDate.now();
        // createdAt이 2년이 지났는지 확인
        long yearsBetween = ChronoUnit.YEARS.between(createdAt, currentDate);
        return yearsBetween >= 2;
    }

    //1순위 판별(투기과열/청약과열지역)
    private boolean isFirstPriorityInSpeculativeHotZone(Account account, Condition01 condition01, Condition03 condition03, List<Family> families){
        boolean isFirstPriorityInSpeculativeHotZone = true;

        // 2년이 지났는지 확인
        if(!isCreatedAtMoreThanTwoYearsAgo(account.getCreatedAt())){
            return false;
        }

        // 24회 이상 납입했는지 확인
        if (account.getPaymentCount() < 24) {
            return false;
        }

        // 세대주인지 확인
        if (!condition01.getIsHouseHolder()) {
            return false;
        }

        // 무주택세대인지 확인
        for (Family family : families) {
            if(family.getHouseCount()>=1){
                return false;
            }

            if (family.getHouseSoldDate() != null) {
                // 주택 처분일이 5년이 안지났으면
                if (isWithin5Years(family.getHouseSoldDate())) {
                    return false;
                }
            }
        }

        return isFirstPriorityInSpeculativeHotZone;
    }

    //1순위 판별(일반 수도권)
    private boolean isFirstPriorityInGeneralCapitalRegion(Account account){
        boolean isFirstPriorityInGeneralCapitalRegion = true;

        // 1년이 지났는지 확인
        if (!isCreatedAtMoreThanOneYearAgo(account.getCreatedAt())) {
            return false;
        }

        // 12회 이상 납입했는지 확인
        if (account.getPaymentCount() < 12) {
            return false;
        }

        return isFirstPriorityInGeneralCapitalRegion;
    }

    private boolean isCreatedAtMoreThanOneYearAgo(LocalDate createdAt) {
        LocalDate currentDate = LocalDate.now();
        // createdAt이 1년이 지났는지 확인
        long yearsBetween = ChronoUnit.YEARS.between(createdAt, currentDate);
        return yearsBetween >= 1;
    }

    //1순위 판별(수도권 외)
    private boolean isFirstPriorityOutsideCapitalRegion(Account account){
        boolean isFirstPriorityOutsideCapitalRegion = true;

        // 6개월이 지났는지 확인
        if (!isCreatedAtMoreThanSixMonthsAgo(account.getCreatedAt())) {
            return false;
        }

        // 6회 이상 납입했는지 확인
        if (account.getPaymentCount() < 6) {
            return false;
        }

        return isFirstPriorityOutsideCapitalRegion;
    }

    private boolean isCreatedAtMoreThanSixMonthsAgo(LocalDate createdAt) {
        LocalDate currentDate = LocalDate.now();
        // createdAt이 6개월이 지났는지 확인
        long monthsBetween = ChronoUnit.MONTHS.between(createdAt, currentDate);
        return monthsBetween >= 6;
    }

    //통장 가입일 6개월 판별
    private boolean isSixMonthsAgo(LocalDate createdAt) {
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);  // 6개월 전 날짜 계산
        return createdAt.isBefore(sixMonthsAgo);  // createdAt이 6개월 전 이전이면 true 반환
    }

    //6년 이내 판별
    private static boolean isWithin6Years(LocalDate birthday) {
        LocalDate sixYearsAgo = LocalDate.now().minusYears(6);
        return birthday.isAfter(sixYearsAgo) && birthday.isBefore(LocalDate.now());
    }

    // 5년 이내 판별
    private static boolean isWithin5Years(LocalDate localDate) {
        LocalDate sixYearsAgo = LocalDate.now().minusYears(5);
        return localDate.isAfter(sixYearsAgo) && localDate.isBefore(LocalDate.now());
    }
}