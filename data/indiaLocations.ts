export const INDIA_LOCATIONS = [
  { state: 'Andhra Pradesh', cities: ['Visakhapatnam', 'Vijayawada', 'Tirupati', 'Guntur', 'Nellore'] },
  { state: 'Arunachal Pradesh', cities: ['Itanagar', 'Tawang', 'Naharlagun'] },
  { state: 'Assam', cities: ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat'] },
  { state: 'Bihar', cities: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur'] },
  { state: 'Chhattisgarh', cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba'] },
  { state: 'Goa', cities: ['Panaji', 'Vasco da Gama', 'Margao', 'Mapusa'] },
  { state: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'] },
  { state: 'Haryana', cities: ['Gurugram', 'Faridabad', 'Panipat', 'Hisar', 'Karnal'] },
  { state: 'Himachal Pradesh', cities: ['Shimla', 'Dharamshala', 'Manali', 'Solan'] },
  { state: 'Jharkhand', cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'] },
  { state: 'Karnataka', cities: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi', 'Shivamogga'] },
  { state: 'Kerala', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'] },
  { state: 'Madhya Pradesh', cities: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'] },
  { state: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad'] },
  { state: 'Manipur', cities: ['Imphal', 'Thoubal', 'Churachandpur'] },
  { state: 'Meghalaya', cities: ['Shillong', 'Tura', 'Jowai'] },
  { state: 'Mizoram', cities: ['Aizawl', 'Lunglei', 'Champhai'] },
  { state: 'Nagaland', cities: ['Kohima', 'Dimapur', 'Mokokchung'] },
  { state: 'Odisha', cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Sambalpur'] },
  { state: 'Punjab', cities: ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda'] },
  { state: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner'] },
  { state: 'Sikkim', cities: ['Gangtok', 'Namchi', 'Gyalshing'] },
  { state: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'] },
  { state: 'Telangana', cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'] },
  { state: 'Tripura', cities: ['Agartala', 'Udaipur', 'Dharmanagar'] },
  { state: 'Uttar Pradesh', cities: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Noida', 'Ghaziabad', 'Meerut'] },
  { state: 'Uttarakhand', cities: ['Dehradun', 'Haridwar', 'Rishikesh', 'Haldwani', 'Nainital'] },
  { state: 'West Bengal', cities: ['Kolkata', 'Siliguri', 'Durgapur', 'Asansol', 'Howrah'] },
  { state: 'Andaman and Nicobar Islands', cities: ['Port Blair'] },
  { state: 'Chandigarh', cities: ['Chandigarh'] },
  { state: 'Dadra and Nagar Haveli and Daman and Diu', cities: ['Daman', 'Diu', 'Silvassa'] },
  { state: 'Delhi', cities: ['New Delhi', 'Delhi'] },
  { state: 'Jammu and Kashmir', cities: ['Srinagar', 'Jammu', 'Anantnag'] },
  { state: 'Ladakh', cities: ['Leh', 'Kargil'] },
  { state: 'Lakshadweep', cities: ['Kavaratti', 'Agatti'] },
  { state: 'Puducherry', cities: ['Puducherry', 'Oulgaret', 'Karaikal'] },
].sort((a, b) => a.state.localeCompare(b.state));

export const INDIA_STATES = INDIA_LOCATIONS.map(location => location.state);

export function citiesForState(state: string) {
  return INDIA_LOCATIONS.find(location => location.state === state)?.cities || [];
}