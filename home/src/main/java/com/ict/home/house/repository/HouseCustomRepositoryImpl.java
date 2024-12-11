package com.ict.home.house.repository;

import com.ict.home.house.model.House;
import com.ict.home.house.model.QDetail;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.ict.home.house.model.QDetail.*;
import static com.ict.home.house.model.QDetail01.*;
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
                                             List<String> status,
                                             Long userCondition,
                                             String orderBy) {
        // 쿼리 생성
        BooleanBuilder builder = new BooleanBuilder();

        // houseTypes 조건 추가 (국민주택, 민영주택, 무순위)
        if (houseTypes != null && !houseTypes.isEmpty()) {
            BooleanBuilder houseTypesBuilder = new BooleanBuilder();

            // "국민주택"에 대한 조건 추가
            if (houseTypes.contains("국민주택")) {
                houseTypesBuilder.or(house.houseSecd.eq("01")
                        .and(detail01.houseDtlSecd.eq("03")));
            }

            // "민영주택"에 대한 조건 추가
            if (houseTypes.contains("민영주택")) {
                houseTypesBuilder.or(house.houseSecd.eq("01")
                        .and(detail01.houseDtlSecd.eq("01")));
            }

            // "무순위"에 대한 조건 추가
            if (houseTypes.contains("무순위")) {
                houseTypesBuilder.or(house.houseSecd.eq("04"));
            }

            builder.and(houseTypesBuilder);
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

        return jpaQueryFactory.select(house)
                .from(house)
                .leftJoin(detail01).on(house.houseId.eq(detail01.house.houseId))  // house와 detail01 테이블을 id 값으로 조인
                .leftJoin(detail).on(house.houseId.eq(detail.house.houseId)) // house와 detail 테이블을 id 값으로 조인
                .where(builder)
                .fetch();
    }
}
