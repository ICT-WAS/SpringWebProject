package com.ict.home.house.dto;

import com.ict.home.house.model.Detail01;
import com.ict.home.house.model.Detail04;
import com.ict.home.house.model.House;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@Schema(title = "주택청약 공고 상세 페이지에 넘겨줄 dto")
public class HouseDetailDTO {

    @Schema(title = "House Entity")
    private House house;

    @Schema(title = "Detail01 Entity")
    private Detail01 detail01;

    @Schema(title = "Detail04 Entity")
    private Detail04 detail04;

    @Schema(title = "타입별 상세 정보를 담고있는 dto")
    private List<HouseDetailInfoDTO> houseDetailInfoDTOList;
}
