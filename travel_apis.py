# travel_apis.py
from datetime import datetime, timedelta

# ----------------- ITINERARY -----------------
def fetch_itinerary(origin, destination, start_date, end_date, interests=None):
    """
    Returns a daily itinerary string for the trip.
    Format:
    ## Day 1: City Highlights
    - Visit X
    - Visit Y
    ## Day 2: More Highlights
    - Visit Z
    """
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    days = (end - start).days + 1
    
    itinerary = f"Your AI-powered itinerary for {destination} with interests {interests or 'General'}.\n\n"
    
    for i in range(days):
        day = start + timedelta(days=i)
        itinerary += f"## Day {i+1} ({day.strftime('%A, %d %b %Y')})\n"
        itinerary += f"- Explore main attractions of {destination}\n"
        itinerary += "- Enjoy local cuisine\n"
        itinerary += "- Visit museums and cultural spots\n\n"
    
    return itinerary

# ----------------- FLIGHTS -----------------
def fetch_flights(origin, destination, start_date, end_date):
    """
    Returns a list of flight dictionaries.
    Each flight: airline, flight_numbers, departure, arrival, duration, price, source_code, dest_code, start_date, end_date, layovers
    """
    flights = [
        {
            "airline": "Air India",
            "flight_numbers": "AI101",
            "departure": f"{start_date} 09:00",
            "arrival": f"{start_date} 11:00",
            "duration": "2h",
            "price": "$150",
            "source_code": origin[:3].upper(),
            "dest_code": destination[:3].upper(),
            "start_date": start_date,
            "end_date": end_date,
            "layovers": []
        },
        {
            "airline": "IndiGo",
            "flight_numbers": "6E202",
            "departure": f"{start_date} 14:00",
            "arrival": f"{start_date} 16:00",
            "duration": "2h",
            "price": "$140",
            "source_code": origin[:3].upper(),
            "dest_code": destination[:3].upper(),
            "start_date": start_date,
            "end_date": end_date,
            "layovers": [{"name": "Mumbai", "duration": "1h"}]
        }
    ]
    return flights

# ----------------- WEATHER -----------------
def fetch_weather(destination, start_date, end_date):
    """
    Returns weather data dictionary for each date.
    """
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    days = (end - start).days + 1
    
    weather_data = {}
    for i in range(days):
        day = start + timedelta(days=i)
        weather_data[day.strftime("%Y-%m-%d")] = {
            "max_temp": 35 - i % 5,   # Example values
            "min_temp": 25 - i % 5,
            "precipitation": 2 * (i % 3),
            "type": "Sunny" if i % 2 == 0 else "Partly Cloudy"
        }
    
    return weather_data

# ----------------- TOURIST SPOTS -----------------
def fetch_places(destination):
    """
    Returns a list of places with name, images, location details.
    """
    places = [
        {
            "name": f"{destination} Historical Museum",
            "images": ["https://via.placeholder.com/300x200.png?text=Museum+1"],
            "location": {"address": "123 Museum Street", "map_url": "https://maps.google.com"}
        },
        {
            "name": f"{destination} Famous Temple",
            "images": ["https://via.placeholder.com/300x200.png?text=Temple+1"],
            "location": {"address": "456 Temple Road", "map_url": "https://maps.google.com"}
        },
        {
            "name": f"{destination} Central Market",
            "images": ["https://via.placeholder.com/300x200.png?text=Market+1"],
            "location": {"address": "789 Market Lane", "map_url": "https://maps.google.com"}
        }
    ]
    return places
