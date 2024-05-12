import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import { Map, PigeonMarker } from "pigeon-maps"

 
const MovieList = (props) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userCountry, setUserCountry] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [movies, setMovies] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
   // Define placeholder coordinates for cinemas
   const cinemas = [
    { id: 1, name: 'Cinema 1', latitude: 50.882, longitude: 4.690 },
    { id: 2, name: 'Cinema 2', latitude: 50.875, longitude: 4.705 },
    // Add more cinemas with placeholder coordinates as needed
  ];
    useEffect(() => {
      // Get user's current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }, []);
  useEffect(() => {
    
  }, []);

  useEffect(() => {
    if (userCountry) {
      fetchMoviesByCountry(userCountry);
    }
  }, [userCountry]);

  const getUserCountry = async () => {
    try {
      console.log('Getting user country...');
      if (navigator.geolocation) {
        console.log('Geolocation supported. Fetching current position...');
        navigator.geolocation.getCurrentPosition(async (position) => {
          console.log('Current position fetched:', position.coords);
          const { latitude, longitude } = position.coords;
          console.log('Latitude:', latitude, 'Longitude:', longitude);
          console.log('Fetching country from location...');
          const country = await getCountryFromLocation(latitude, longitude);
          console.log('User country:', country);
          setUserCountry(country);
        });
      } else {
        setErrorMsg('Geolocation is not supported by this browser.');
      }
    } catch (error) {
      console.error('Error getting user country:', error);
      setErrorMsg('Error getting user country: ' + error.message);
    }
  };

  
  const getCountryFromLocation = async (latitude, longitude) => {
    try {
      console.log('Fetching country from location:', latitude, longitude);
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=2de1c3f556354322b312077954676795`);
      console.log('Location data response:', response.data);
      const country = response.data.results[0].components.country;
      console.log('Country:', country);
      return country;
    } catch (error) {
      console.error('Error getting country from location:', error);
      throw new Error('Error getting country from location: ' + error.message);
    }
  };

  const fetchMoviesByCountry = async (country) => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: '00e58447b107bbf5456c351874f74894',
          region: country,
        },
      });
      setMovies(response.data.results);
      
    } catch (error) {
      console.error('Error fetching movies by country:', error);
    }
  };

  const handleClick = async (movie) => {
    try {
      const detailsResponse = await fetchMovieDetails(movie.id);
      const trailerId = await fetchMovieTrailer(movie.id);
      setSelectedMovie({ ...detailsResponse, trailer: trailerId });
    } catch (error) {
      console.error('Error fetching movie details and trailer:', error);
    }
  };
  

  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: {
          api_key: '00e58447b107bbf5456c351874f74894',
        },
      });
      console.log('waaaaaaaaaaaaaaaaaaaaaaaaa',response.data);
      return response.data;
      
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  };

  const fetchMovieTrailer = async (movieId) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
        params: {
          api_key: '00e58447b107bbf5456c351874f74894',
        },
      });
      return response.data.results[0].key;
    } catch (error) {
      console.error('Error fetching movie trailer:', error);
      return null;
    }
  };

  
  const FavouriteComponent = props.favouriteComponent;

  return (
    <>
 <button onClick={getUserCountry} className="btn btn-light p-1" style={{ width: '30px', height: '30px' }}>
  <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-geo" fill="currentColor" viewBox="0 0 16 16" style={{ width: '18px', height: '18px' }}>
    <path fillRule="evenodd" d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/>
  </svg>
</button>

{props.movies.map((movie, index) => (
      <div className='image-container d-flex justify-content-start m-3'>
        
        <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt='movie' onClick={() => handleClick(movie)} />
          
        <div
          onClick={() => props.handleFavouritesClick(movie)}
          className='overlay d-flex align-items-center justify-content-center'
        >
          <FavouriteComponent />
        </div>
        
      </div>
    ))}
     
      {movies.map((movie, index) => (
        <div className='image-container d-flex justify-content-start m-3' key={index}>
          <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt='movie' onClick={() => handleClick(movie)} />
          
          <div onClick={() => props.handleFavouritesClick(movie)} className='overlay d-flex align-items-center justify-content-center'>
            <FavouriteComponent />
          </div>
        </div>
      ))}
      {selectedMovie && (
        <div className='image-container d-flex justify-content-start m-3'>
          <div className='selected-movie-details'>
            <div className='movie-info'>
              <img src={`https://image.tmdb.org/t/p/w500/${selectedMovie.poster_path}`} alt='selected movie poster' />
              <div>
                <h2>{selectedMovie.title}</h2>
                <p>{selectedMovie.overview}</p>
              </div>
            </div>
            <div className='trailer-container'>
              <iframe
                width='560'
                height='315'
                src={`https://www.youtube.com/embed/${selectedMovie.trailer}`}
                title='YouTube video player'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              ></iframe>
            </div>
            <Map height={300} defaultCenter={[50.879, 4.6997]} defaultZoom={11}>
      {/* Markers for cinemas */}
      {cinemas.map(cinema => (
        <PigeonMarker
          key={cinema.id}
          anchor={[cinema.latitude, cinema.longitude]}
          payload={cinema}
     