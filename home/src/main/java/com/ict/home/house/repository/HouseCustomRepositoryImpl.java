package com.ict.home.house.repository;

import com.ict.home.house.model.House;
import com.ict.home.house.model.QDetail;
import com.ict.home.house.model.QDetail04;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

import static com.ict.home.house.model.QDetail.*;
import static com.ict.home.house.model.QDetail01.*;
import static com.ict.home.house.model.QDetail04.*;
import static com.ict.home.house.model.QHouse.*;


@Repository
@AllArgsConstructor
public class HouseCustomRepositoryImpl implements HouseCustomRepository{

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<House> findFilteredHouseList(List<String> regions,
                                             List<String> houseTypes,
                                             List<String> area,
                                             List<Integer> prices,
                                             List<String> supplies,
                                             List<String> statuses,
                                             Long userCondition,
                                             String orderBy) {
        // 쿼리 생성
        BooleanBuilder builder = new BooleanBuilder();

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
        if (prices != null && prices.size()==2){
            BooleanBuilder priceBuilder = new BooleanBuilder();

            Integer start = prices.get(0);
            Integer end = prices.get(1);

            priceBuilder.or(detail.lttotTopAmount.between(start, end)); // 가격 범위

            builder.and(priceBuilder);
        }

        // supplies 조건 추가 (공급 조건 필터링)
        if (supplies != null && !supplies.isEmpty()){
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
