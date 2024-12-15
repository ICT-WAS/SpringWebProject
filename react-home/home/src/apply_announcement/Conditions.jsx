import { Nav, Stack, Table } from "react-bootstrap";
import React, { useState } from 'react';
import { conditionInfo } from './conditionInfo.js';
import TwoHandleRange from "./TwoHandleRange.jsx";

/* 조건 선택박스 */
export default function Conditions({ onClickedFilter }) {

    const conditionCards = {
      WishRegion: (props) => <WishRegion {...props} />,
      HomeInfo: (props) => <HomeInfo {...props} />,
      ApplicationPeriod: (props) => <ApplicationPeriod {...props} />,
    };
  
    const [selectedCondition, setSelectedCondition] = useState(<WishRegion onClickedFilter={onClickedFilter} />);
  
    const handleSelect = (eventKey) => {
      if (conditionCards[eventKey]) {
        const ResultComponent = conditionCards[eventKey];
        setSelectedCondition(<ResultComponent onClickedFilter={onClickedFilter} />);
      }
    };
  
    return (
      <>
        <p className='heading-text'>
          조건검색
        </p>
  
        <Nav justify variant="tabs" defaultActiveKey="WishRegion" onSelect={handleSelect} style={{ paddingRight: 0 }}>
          <Nav.Item style={{ color: 'gray' }}>
            <Nav.Link className='condition-nav' eventKey="WishRegion">희망지역</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className='condition-nav' eventKey="HomeInfo">주택정보</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className='condition-nav' eventKey="ApplicationPeriod">모집정보</Nav.Link>
          </Nav.Item>
        </Nav>
        {selectedCondition}
      </>
    );
  }
  
  function SubcategorySection({ subcategoryIndex, category, values, handleClick }) {
    return <>
      <div className='border-div'>
        <p className='filter-category'>
          {category}
        </p>
        <hr className='p-text' />
        <div className="scrollable-table">
          <Table hover borderless>
            <tbody>
  
              {values.map((item, index) => (
                <tr key={item + index} onClick={handleClick}>
                  <td data-subcategory-index={subcategoryIndex}
                    data-subcategory={category}
                    data-index={index} data-value={item.value}>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  }
  
  /* 희망지역 */
  function WishRegion({ onClickedFilter }) {
  
    const categoryName = conditionInfo.wishRegion.category;
    const sidoData = conditionInfo.wishRegion.subcategories;
    const [sidoIndex, setSidoIndex] = useState(0);
    const [gunguData, setGunguData] = useState(sidoData[0].values);
  
  
    function handleClickSido(e) {
      const selectedIndex = e.target.getAttribute('data-index');
      setSidoIndex(selectedIndex);
      setGunguData(sidoData[selectedIndex].values);
    }
  
    function handleClick(e) {
      const selectedValue = e.target.getAttribute('data-value');
      const index = e.target.getAttribute('data-index');
      const subcategoryName = sidoData[sidoIndex].category;
  
      let submitData = null;
      if (index >= 0) {
        submitData = sidoData[sidoIndex].category + ' ' + gunguData[index].value;
      }
  
      onClickedFilter({ category: categoryName, subcategoryName: subcategoryName, value: selectedValue, submitData: submitData });
    }
  
  
    const sidoList = () => {
      return sidoData.map((item, index) => (
        <tr key={item + index} onClick={handleClickSido}>
          <td data-index={index} data-value={item.category}>{item.category}</td>
        </tr>
      ));
    }
  
    const gunguList = () => {
      return gunguData.map((item, index) => (
        <tr key={item + index} onClick={handleClick}>
          <td data-index={index} data-value={sidoData[sidoIndex].category + '>' + item.value}>{item.value}</td>
        </tr>
      ));
    }
  
    return (
      <>
        <Stack direction='horizontal' style={{ width: '100%', padding: '0' }} gap={1}>
          <div className='border-div'>
            <p className='filter-category'>
              시/도
            </p>
            <hr className='p-text' />
            <div className="scrollable-table">
              <Table hover borderless>
                <tbody>
                  {sidoList()}
                </tbody>
  
              </Table>
            </div>
          </div>
  
          <div className='border-div'>
            <p className='filter-category'>
              구/군
            </p>
            <hr className='p-text' />
            <div className="scrollable-table">
              <Table hover borderless>
                <tbody>
                  <tr key={'전체0'} onClick={handleClick}>
                    <td data-index={-1} data-value={sidoData[sidoIndex].category + ' 전체'}>{'전체'}</td>
                  </tr>
                  {gunguList()}
                </tbody>
              </Table>
            </div>
          </div>
        </Stack>
      </>
    );
  }
  
  /* 주택정보 */
  function HomeInfo({ onClickedFilter }) {
  
    const categoryName = conditionInfo.homeInfo.category;
    const subcategories = conditionInfo.homeInfo.subcategories;
  
    function handleClick(e) {
      const selectedValue = e.target.getAttribute('data-value');
      const subcategoryIndex = e.target.getAttribute('data-subcategory-index');
      const subcategoryName = subcategories[subcategoryIndex].category;
      const submitData = selectedValue.split('(')[0];
      onClickedFilter({ category: categoryName, subcategoryName: subcategoryName, value: selectedValue, submitData: submitData });
    }
  
    const subCategorieSections = () => {
      return subcategories.map((subCategory, index) =>
        <SubcategorySection key={subCategory + index}
          subcategoryIndex={index}
          category={subCategory.category}
          values={subCategory.values}
          handleClick={handleClick} />
      );
    }
  
    return (
      <>
        <Stack direction='horizontal' style={{ width: '100%', padding: '0' }} gap={1}>
          {subCategorieSections()}
  
          {/* 공급금액 */}
          <SupplyPirce categoryName={categoryName} onClickedFilter={onClickedFilter} />
  
        </Stack>
      </>
    );
  }
  
  /* 공급금액 */
  // 단위 : 만
  function SupplyPirce({ categoryName, onClickedFilter }) {
  
    const subCategoryName = '공급금액';
    const [values, setValues] = useState([0, 150000]); // 초기 값 [최소, 최대]
    const [minPrice, setMinPrice] = useState('0만');
    const [maxPrice, setMaxPrice] = useState('15억');
  
    function handleRangeChanged(newValues) {
      setValues(newValues);
  
      const newMinPrice = formatCurrency(newValues[0]);
      const newMaxPrice = formatCurrency(newValues[1]);
      setMinPrice(newMinPrice);
      setMaxPrice(newMaxPrice);
  
      const newVlaue = newMinPrice + " ~ " + newMaxPrice;
      onClickedFilter({ category: categoryName, subcategoryName: subCategoryName, value: newVlaue, submitData: newValues });
    }
  
    return (
      <>
        <div className='border-div'>
          <p className='filter-category'>
            {subCategoryName}
          </p>
          <hr className='p-text' />
          <div className="scrollable-table">
            <Table hover borderless>
              <tbody>
                <tr>
                  <td data-min={values[0]} data-max={values[1]}>
                    <TwoHandleRange onChangeValue={handleRangeChanged} />
                  </td>
                </tr>
                <tr>
                  <td>
                    {minPrice} ~ {maxPrice}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </>
    );
  }
  
  function formatCurrency(amount) {
    if (amount === 0) return "0만";
  
    let result = "";
  
    const units = ["만", "억", "조"];
    let unitIndex = 0;
  
    while (amount > 0) {
      const part = amount % 10000; // 10,000 단위로 나눔
      if (part > 0) {
        const formattedPart = new Intl.NumberFormat('ko-KR').format(part);
        result = `${formattedPart}${units[unitIndex]} ${result}`.trim();
      }
      amount = Math.floor(amount / 10000); // 다음 단위로 넘어감
      unitIndex++;
    }
  
    return result.trim();
  }
  
  /* 모집정보 */
  function ApplicationPeriod({ onClickedFilter }) {
  
    const categoryName = conditionInfo.applicationPeriod.category;
    const subcategories = conditionInfo.applicationPeriod.subcategories;
  
    function handleClick(e) {
      const selectedValue = e.target.getAttribute('data-value');
      const subcategoryIndex = e.target.getAttribute('data-subcategory-index');
      const subcategoryName = subcategories[subcategoryIndex].category;
      onClickedFilter({ category: categoryName, subcategoryName: subcategoryName, value: selectedValue, submitData: selectedValue });
    }
  
    const subCategorieSections = () => {
      return subcategories.map((subCategory, index) =>
        <SubcategorySection key={subCategory + index}
          subcategoryIndex={index}
          category={subCategory.category}
          values={subCategory.values}
          handleClick={handleClick} />
      );
    }
  
    return (
      <>
        <Stack direction='horizontal' style={{ width: '100%', padding: '0' }} gap={1}>
          {subCategorieSections()}
        </Stack>
      </>
    );
  }