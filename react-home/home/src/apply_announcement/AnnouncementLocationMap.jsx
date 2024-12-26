import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container as MapDiv, NaverMap, useNavermaps, Marker } from 'react-naver-maps';

export default function AnnouncementLocationMap({ address = null, houseName = null }) {
  const navermaps = useNavermaps()

  const zoomLevel = 18;

  const [location, setLocation] = useState(null);

  const getGeocode = async () => {
    if (address === null) return;

    axios
      .get('http://localhost:8989/house/api/geocode', {
        params: { query: address }
      })
      .then((response) => {
        if (response.data.x > 0) {
          const location = { x: response.data.x, y: response.data.y };

          setLocation(location);
        }

      })
      .catch((error) => {
        console.error('Error fetching geocode:', error);
      });
  }

  useEffect(() => {
    getGeocode();
  }, [address]);

  if (location === null) {
    return;
  }

  return (
    <div className='mb-5'>
      <div className='house-detail'>
        <section className='mb-5'>
          <h2>공급 위치</h2>
          <hr />
        </section></div>

      <div style={{ minHeight: '300px' }}>

        <MapDiv
          style={{
            position: 'relative',
            width: '100%',
            height: '600px',
          }}
        >
          <NaverMap
            // uncontrolled
            center={new navermaps.LatLng(location)}
            defaultZoom={zoomLevel}
            defaultMapTypeId={navermaps.MapTypeId.NORMAL}
          >
            <Marker position={new navermaps.LatLng(location)} title={houseName || ''} />
          </NaverMap>
        </MapDiv>
      </div>
    </div>
  )
}

