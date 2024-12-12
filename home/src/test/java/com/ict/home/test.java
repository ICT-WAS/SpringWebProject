package com.ict.home;

import com.ict.home.house.model.Detail;
import com.ict.home.house.model.Detail01;
import com.ict.home.house.model.Detail04;
import com.ict.home.house.model.House;
import com.ict.home.house.repository.HouseCustomRepositoryImpl;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
public class test {

    @PersistenceContext
    private EntityManager em;


    @Test
    public void test(){
        House house = em.find(House.class, 1059L);

        System.out.println(house);

        List<Detail> houseDetailList = em.createQuery(
                        "SELECT d From Detail d WHERE d.house.id = :houseId", Detail.class)
                .setParameter("houseId", house.getHouseId())
                .getResultList();
        houseDetailList.forEach(System.out::println);

        String no = house.getHouseSecd().equals("01") ? "01" : "04";
        String queryString = "SELECT d FROM Detail" + no + " d WHERE d.house.id = :houseId";

        if ("01".equals(no)) {
            // Detail01에 대한 쿼리
            Detail01 detail01 = em.createQuery(queryString, Detail01.class)
                    .setParameter("houseId", house.getHouseId())
                    .getSingleResult();
            System.out.println("APT입니다: " + detail01);
        } else {
            // Detail04에 대한 쿼리
            Detail04 detail04 = em.createQuery(queryString, Detail04.class)
                    .setParameter("houseId", house.getHouseId())
                    .getSingleResult();
            System.out.println("무순위 입니다: " + detail04);
        }
    }

    @Autowired
    private HouseCustomRepositoryImpl hr;

    @Test
    public void test02(){
        List<String> list = new ArrayList<>();
        list.add("무순위");
        list.add("국민주택");

        List<String> list2 = new ArrayList<>();

        list2.add("20평 미만");
        list2.add("30평대");

        List<House> filteredHouseList = hr.findFilteredHouseList(list, list, list2, null, null, null, null, null);

        filteredHouseList.forEach(System.out::println);
        System.out.println(filteredHouseList.size());
    }
}