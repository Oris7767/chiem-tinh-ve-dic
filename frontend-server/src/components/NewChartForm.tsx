// frontend-server/src/components/NewChartForm.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { chartService } from '../services/chartService';
import './NewChartForm.css';

interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string | null;
}

interface UserLocation {
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface FormData {
  name: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  latitude: string | number;
  longitude: string | number;
  timezone: string;
}

function NewChartForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    birth_date: '',
    birth_time: '',
    birth_place: '',
    latitude: '',
    longitude: '',
    timezone: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  // Lấy vị trí hiện tại của người dùng khi trang được tải
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data && data.city) {
          setUserLocation({
            city: data.city,
            region: data.region,
            country: data.country_name,
            latitude: data.latitude,
            longitude: data.longitude,
            timezone: data.timezone
          });
        }
      } catch (err) {
        console.error('Error fetching user location:', err);
      }
    };

    getUserLocation();
  }, []);

  // Tìm kiếm thành phố với Geoapify
  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
      if (!apiKey) {
        setError("Geoapify API key is missing. Please check your environment variables.");
        return;
      }
      
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&type=city&format=json&apiKey=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data.results) {
        setSearchResults(data.results.map((place: any) => {
          // Tạo tên địa điểm đầy đủ
          const name = [
            place.name,
            place.state,
            place.country
          ].filter(Boolean).join(', ');
          
          return {
            id: place.place_id,
            name: name,
            latitude: place.lat,
            longitude: place.lon,
            timezone: place.timezone?.name || null
          };
        }));
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error searching places:', err);
      setError('Failed to search places. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Lấy timezone dựa trên tọa độ (nếu không có từ Geoapify)
  const fetchTimezone = async (lat: number, lng: number) => {
    try {
      const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const timezone = data.features[0].properties.timezone?.name;
        if (timezone) {
          setFormData(prev => ({
            ...prev,
            timezone: timezone
          }));
          return;
        }
      }
      
      // Fallback to ipapi for timezone
      const ipapiResponse = await fetch(`https://ipapi.co/timezone/`);
      const ipapiTimezone = await ipapiResponse.text();
      
      setFormData(prev => ({
        ...prev,
        timezone: ipapiTimezone || 'UTC'
      }));
    } catch (err) {
      console.error('Error fetching timezone:', err);
      // Default fallback
      setFormData(prev => ({
        ...prev,
        timezone: 'UTC'
      }));
    }
  };

  // Xử lý khi người dùng thay đổi truy vấn tìm kiếm
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Tìm kiếm sau khi người dùng ngừng gõ 300ms
    const timeoutId = setTimeout(() => {
      searchPlaces(query);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  // Xử lý khi người dùng chọn một thành phố
  const handleSelectPlace = async (place: Place) => {
    setFormData(prev => ({
      ...prev,
      birth_place: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      timezone: place.timezone || prev.timezone
    }));
    
    setSearchQuery('');
    setSearchResults([]);
    
    // Nếu không có timezone từ kết quả, gọi fetchTimezone
    if (!place.timezone) {
      await fetchTimezone(place.latitude, place.longitude);
    }
  };

  // Xử lý khi người dùng chọn vị trí hiện tại
  const handleUseCurrentLocation = () => {
    if (userLocation) {
      setFormData(prev => ({
        ...prev,
        birth_place: `${userLocation.city}, ${userLocation.region}, ${userLocation.country}`,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        timezone: userLocation.timezone
      }));
      
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.birth_place || !formData.latitude || !formData.longitude || !formData.timezone) {
      setError('Please select a birth place with valid coordinates and timezone');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await chartService.saveChart({
        name: formData.name,
        birth_date: formData.birth_date,
        birth_time: formData.birth_time,
        birth_place: formData.birth_place,
        latitude: parseFloat(String(formData.latitude)),
        longitude: parseFloat(String(formData.longitude)),
        timezone: formData.timezone
      });
      
      navigate(`/chart/${result.chart.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create chart. Please try again.');
      console.error('Chart creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-chart-form">
      <h1>Create New Birth Chart</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="birth_date">Birth Date</label>
          <input
            type="date"
            id="birth_date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="birth_time">Birth Time</label>
          <input
            type="time"
            id="birth_time"
            name="birth_time"
            value={formData.birth_time}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="search_place">Birth Place</label>
          <div className="search-container">
            <input
              type="text"
              id="search_place"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for a city..."
              className="search-input"
              autoComplete="off"
            />
            {userLocation && (
              <button 
                type="button" 
                onClick={handleUseCurrentLocation}
                className="use-location-btn"
              >
                Use Current Location
              </button>
            )}
          </div>
          
          {isSearching && <div className="search-loading">Searching...</div>}
          
          {searchResults.length > 0 && (
            <ul className="search-results">
              {searchResults.map((place) => (
                <li 
                  key={place.id} 
                  onClick={() => handleSelectPlace(place)}
                  className="search-result-item"
                >
                  {place.name}
                </li>
              ))}
            </ul>
          )}
          
          {formData.birth_place && (
            <div className="selected-place">
              <p>Selected: {formData.birth_place}</p>
            </div>
          )}
        </div>
        
        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="latitude">Latitude</label>
            <input
              type="text"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group half">
            <label htmlFor="longitude">Longitude</label>
            <input
              type="text"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="timezone">Timezone</label>
          <input
            type="text"
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            className="cancel-button"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="submit-button"
          >
            {loading ? 'Creating...' : 'Create Chart'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewChartForm;
