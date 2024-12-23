package com.ict.home.house.service;

import com.ict.home.condition.model.*;
import com.ict.home.condition.repository.AccountRepository;
import com.ict.home.condition.repository.Condition01Repository;
import com.ict.home.condition.repository.Condition03Repository;
import com.ict.home.condition.repository.FamilyRepository;
import com.ict.home.house.dto.HouseDetailDTO;
import com.ict.home.house.dto.HouseDetailInfoDTO;
import com.ict.home.house.dto.HouseInfo;
import com.ict.home.house.dto.HouseTypeDTO;
import com.ict.home.house.model.Detail;
import com.ict.home.house.model.Detail01;
import com.ict.home.house.model.Detail04;
import com.ict.home.house.model.House;
import com.ict.home.house.repository.Detail01Repository;
import com.ict.home.house.repository.Detail04Repository;
import com.ict.home.house.repository.DetailRepository;
import com.ict.home.house.repository.HouseCustomRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class HouseServiceImpl implements HouseService {

    @PersistenceContext
    private final EntityManager em;

    private final HouseCustomRepository hr;

    private final DetailRepository dr;

    private final Detail01Repository d01r;

    private final Detail04Repository d04r;

    private final AccountRepository ar;

    private final Condition01Repository c01r;

    private final Condition03Repository c03r;

    private final FamilyRepository fr;

    public List<HouseInfo> getHouseInfoListByFilter(List<String> regions,
                                                    List<String> houseTypes,
                                                    List<String> area,
                                                    List<Integer> prices,
                                                    List<String> supplies,
                                                    List<String> statuses,
                                                    Long userId,
                                                    String orderBy) {

        List<Account> accounts = ar.findByUser_Id(userId);
        Condition01 condition01 = c01r.findByUser_Id(userId);
        Condition03 condition03 = c03r.findByUser_Id(userId);
        List<Family> families = fr.findByUser_Id(userId);

        List<House> filteredHouseList = hr.findFilteredHouseList(regions, houseTypes, area, prices, supplies, statuses, accounts, condition01, condition03, families, orderBy);

        List<HouseInfo> filteredHouseInfos = getHouseInfoListByRegionsFilter(filteredHouseList, regions);

        filteredHouseInfos = filteredHouseInfos.stream()
                .sorted((house1, house2) -> house2.getRcritPblancDe().compareTo(house1.getRcritPblancDe()))
                .collect(Collectors.toList());

        return filteredHouseInfos;
    }

    @Override
    public List<HouseInfo> getHouseInfoListByName(String keyword) {
        List<House> houseList = hr.findByName(keyword);
        List<HouseInfo> houseInfoList = new ArrayList<>();

        for (House house : houseList) {
            HouseInfo houseInfo = makeHouseInfo(house);
            houseInfoList.add(houseInfo);
        }

        houseInfoList.sort((houseInfo1, houseInfo2) ->
                houseInfo2.getRcritPblancDe().compareTo(houseInfo1.getRcritPblancDe())
        );

        return houseInfoList;
    }

    @Override
    public HouseDetailDTO getHouseDetail(Long houseId) {
        House house = hr.findById(houseId);
        Detail01 detail01 = null;
        Detail04 detail04 = null;
        List<Detail> details = dr.findByHouse_HouseId(houseId);

        if(house.getHouseSecd().equals("01")){ // 일반공고
            detail01 = d01r.findByHouse_HouseId(houseId).get();
        } else if (house.getHouseSecd().equals("04")) {
            detail04 = d04r.findByHouse_HouseId(houseId).get();
        }

        HouseDetailDTO houseDetailDTO = makeHouseDetailDTO(house, detail01, detail04, details);

        return houseDetailDTO;
    }

    @Override
    public List<HouseInfo> getHouseInfoByInterest(List<House> houses) {
        List<HouseInfo> houseInfoList = new ArrayList<>();
        for (House house : houses) {
            HouseInfo houseInfo = makeHouseInfo(house);
            houseInfoList.add(houseInfo);
        }
        return houseInfoList;
    }

    @Override
    public Map<String, List<String>> getSolution(Long houseId, Long userId, String type) {

        /*
            기타 조건들(투기과열지구 등등등)과 공급 방식, 유저의 조건을 파악하여 지원 가능한지 여부와 개선점 등 맞춤형 솔루션 제공
            공급 방식(무순위): 일반
            공급 방식(일반공고): 1순위, 2순위, 다자녀가구, 신혼부부, 생애최초, 노부모부양, 기관추천, 기타, 이전기관, 청년, 신생아
         */

        // 공고 정보
        Optional<Detail01> optionalDetail01 = d01r.findByHouse_HouseId(houseId);
        Optional<Detail04> optionalDetail04 = d04r.findByHouse_HouseId(houseId);
        House house = hr.findById(houseId);
        Detail01 detail01 = optionalDetail01.orElse(null);
        Detail04 detail04 = optionalDetail04.orElse(null);
        List<Detail> details = dr.findByHouse_HouseId(houseId);

        // 회원 조건 정보
        List<Account> accounts = ar.findByUser_Id(userId);
        Condition01 condition01 = c01r.findByUser_Id(userId);
        Condition03 condition03 = c03r.findByUser_Id(userId);
        List<Family> families = fr.findByUser_Id(userId);

        // satisfied: 충족한 점
        // unsatisfied: 충족하지 못한 점
        // solution: 개선할 수 있는 점
        List<String> satisfied = new ArrayList<>();
        List<String> unsatisfied = new ArrayList<>();
        List<String> solution = new ArrayList<>();

        if ("일반".equals(type)) {
            System.out.println("type: 일반");
        }

        if ("1순위".equals(type)) {
            System.out.println("type: 1순위");
        }

        if ("2순위".equals(type)) {
            System.out.println("type: 2순위");
        }

        if ("다자녀가구".equals(type)) {
            System.out.println("type: 다자녀가구");
        }

        if ("신혼부부".equals(type)) {
            System.out.println("type: 신혼부부");
        }

        if ("생애최초".equals(type)) {
            System.out.println("type: 생애최초");
        }

        if ("노부모부양".equals(type)) {
            System.out.println("type: 노부모부양");
        }

        if ("기관추천".equals(type)) {
            System.out.println("type: 기관추천");
        }

        if ("기타".equals(type)) {
            System.out.println("type: 기타");
        }

        if ("이전기관".equals(type)) {
            System.out.println("type: 이전기관");
        }

        if ("청년".equals(type)) {
            System.out.println("type: 청년");
        }

        if ("신생아".equals(type)) {
            System.out.println("type: 신생아");
        }

        Map<String, List<String>> map = new HashMap<>(){{
            put("satisfied", satisfied);
            put("unsatisfied", unsatisfied);
            put("solution", solution);
        }};

        return map;
    }

    private HouseDetailDTO makeHouseDetailDTO(House house, Detail01 detail01, Detail04 detail04, List<Detail> details) {
        HouseDetailDTO houseDetailDTO = new HouseDetailDTO();
        houseDetailDTO.setHouse(house);
        houseDetailDTO.setDetail01(detail01);
        houseDetailDTO.setDetail04(detail04);

        List<HouseDetailInfoDTO> houseDetailInfoDTOList = makeHouseDetailInfoDTO(house.getHouseSecd(), details);

        for (HouseDetailInfoDTO houseDetailInfoDTO : houseDetailInfoDTOList) {
            Integer maxPrice = houseDetailInfoDTO.getHouseTypeDTOList().stream()
                    .mapToInt(HouseTypeDTO::getPrice)
                    .max()  // 최대값
                    .orElse(Integer.MIN_VALUE);

            houseDetailInfoDTO.setMaxPrice(maxPrice);

            Integer minPrice = houseDetailInfoDTO.getHouseTypeDTOList().stream()
                    .mapToInt(HouseTypeDTO::getPrice)
                    .min()  // 최소값
                    .orElse(Integer.MAX_VALUE);

            houseDetailInfoDTO.setMinPrice(minPrice);
        }

        houseDetailDTO.setHouseDetailInfoDTOList(houseDetailInfoDTOList);

        return houseDetailDTO;
    }

    private List<HouseDetailInfoDTO> makeHouseDetailInfoDTO(String announcementType, List<Detail> details) {

        List<HouseDetailInfoDTO> houseDetailInfoDTOList = new ArrayList<>();

        for (Detail detail : details) {
            String houseType = String.valueOf(Integer.parseInt(detail.getHouseTy().split("\\.")[0]));

            boolean matchFound = houseDetailInfoDTOList.stream()
                    .anyMatch(houseDetail -> houseDetail.getHouseType().equals(houseType));


            HouseDetailInfoDTO detailInfoDTO = null;

            if (!matchFound) {
                detailInfoDTO = new HouseDetailInfoDTO();
                detailInfoDTO.setHouseType(houseType);
                houseDetailInfoDTOList.add(detailInfoDTO);
            } else {
                detailInfoDTO = houseDetailInfoDTOList.stream()
                        .filter(houseDetail -> houseDetail.getHouseType().equals(houseType))
                        .findFirst() // 첫 번째 일치하는 객체를 찾음
                        .orElse(null);
            }
            HouseTypeDTO houseTypeDTO = new HouseTypeDTO();

            houseTypeDTO.setTypeName(detail.getHouseTy());
            houseTypeDTO.setNormalSupply(detail.getSuplyHshldco());
            detailInfoDTO.setNormalSupply(detailInfoDTO.getNormalSupply() + houseTypeDTO.getNormalSupply());
            houseTypeDTO.setPrice(detail.getLttotTopAmount());

            if (announcementType.equals("01")) {
                houseTypeDTO.setSpecialSupply(detail.getSpsplyHshldco());
                detailInfoDTO.setSpecialSupply(detailInfoDTO.getSpecialSupply() + houseTypeDTO.getSpecialSupply());

                houseTypeDTO.setMnychHshldco(detail.getMnychHshldco());
                detailInfoDTO.setMnychHshldco(detailInfoDTO.getMnychHshldco() + houseTypeDTO.getMnychHshldco());

                houseTypeDTO.setNwwdsHshldco(detail.getNwwdsHshldco());
                detailInfoDTO.setNwwdsHshldco(detailInfoDTO.getNwwdsHshldco() + houseTypeDTO.getNwwdsHshldco());

                houseTypeDTO.setLfeFrstHshldco(detail.getLfeFrstHshldco());
                detailInfoDTO.setLfeFrstHshldco(detailInfoDTO.getLfeFrstHshldco() + houseTypeDTO.getLfeFrstHshldco());

                houseTypeDTO.setOldParntsSuportHshldco(detail.getOldParntsSuportHshldco());
                detailInfoDTO.setOldParntsSuportHshldco(detailInfoDTO.getOldParntsSuportHshldco() + houseTypeDTO.getOldParntsSuportHshldco());

                houseTypeDTO.setInsttRecomendHshldco(detail.getInsttRecomendHshldco());
                detailInfoDTO.setInsttRecomendHshldco(detailInfoDTO.getInsttRecomendHshldco() + houseTypeDTO.getInsttRecomendHshldco());

                houseTypeDTO.setEtcHshldco(detail.getEtcHshldco());
                detailInfoDTO.setEtcHshldco(detailInfoDTO.getEtcHshldco() + houseTypeDTO.getEtcHshldco());

                houseTypeDTO.setTransrInsttEnfsnHshldco(detail.getTransrInsttEnfsnHshldco());
                detailInfoDTO.setTransrInsttEnfsnHshldco(detailInfoDTO.getTransrInsttEnfsnHshldco() + houseTypeDTO.getTransrInsttEnfsnHshldco());

                houseTypeDTO.setYgmnHshldco(detail.getYgmnHshldco());
                detailInfoDTO.setYgmnHshldco(detailInfoDTO.getYgmnHshldco() + houseTypeDTO.getYgmnHshldco());

                houseTypeDTO.setNwbbHshldco(detail.getNwbbHshldco());
                detailInfoDTO.setNwbbHshldco(detailInfoDTO.getNwbbHshldco() + houseTypeDTO.getNwbbHshldco());
            }


            List<HouseTypeDTO> houseTypeDTOList = detailInfoDTO.getHouseTypeDTOList();
            houseTypeDTOList.add(houseTypeDTO);

        }
        return houseDetailInfoDTOList;
    }

    private List<HouseInfo> getHouseInfoListByRegionsFilter(List<House> filteredHouseList, List<String> regions) {
        List<HouseInfo> list = new ArrayList<>();

        for (House house : filteredHouseList) {
            HouseInfo houseInfo = makeHouseInfo(house);
            list.add(houseInfo);
        }

        if (regions == null || regions.isEmpty()) {
            return list;
        }

        List<HouseInfo> houseInfoList = new ArrayList<>();

        for (String region : regions) {
            String siDo = region.split(" ")[0];
            String gunGu = region.split(" ")[1];

            List<HouseInfo> filteredList;
            if (region.indexOf("전체") >= 0) {
                filteredList = list.stream()
                        .filter(houseInfo -> siDo.equals(houseInfo.getRegion1()))
                        .collect(Collectors.toList());
            } else {
                filteredList = list.stream()
                        .filter(houseInfo -> siDo.equals(houseInfo.getRegion1()) && gunGu.equals(houseInfo.getRegion2()))
                        .collect(Collectors.toList());
            }

            houseInfoList.addAll(filteredList);
        }

        houseInfoList = houseInfoList.stream()
                .sorted((h1, h2) -> h2.getRcritPblancDe().compareTo(h1.getRcritPblancDe()))
                .collect(Collectors.toList());

        return houseInfoList;
    }

    private HouseInfo makeHouseInfo(House house) {
        HouseInfo houseInfo = new HouseInfo();
        houseInfo.setHouseId(house.getHouseId());
        houseInfo.setHouseManageNo(house.getHouseManageNo());
        houseInfo.setHouseNm(house.getHouseNm());
        houseInfo.setHssplyZip(house.getHssplyZip());
        houseInfo.setHouseSecd(house.getHouseSecd());
        houseInfo.setRcritPblancDe(house.getRcritPblancDe());
        houseInfo.setTotSuplyHsldco(house.getTotSuplyHsldco());

        return houseInfo;
    }
}
