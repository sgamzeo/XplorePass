import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import cheerio from 'cheerio';
import { format, parseISO } from 'date-fns';
import trLocale from 'date-fns/locale/tr';
import FollowArtistCard from '../components/EventDetailScreen/FollowArtistCard';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';  // Türkçe dil dosyasını içe aktar


const EventDetails = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const [eventImageURL, setEventImageURL] = useState(null);
  const [aboutEventText, setAboutEventText] = useState(null);

  

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const API_BASE_URL = 'https://app.ticketmaster.com/discovery/v2/';
        const API_KEY = 'eDrWd2HCOgSP6nDQPpbvBqX6SfC5Lkfe';
        const eventId = 'Z6HyzZyMZGATbAZv';

        const response = await fetch(
          `${API_BASE_URL}events/${eventId}?apikey=${API_KEY}&locale=tr`,
        );

        if (response.ok) {
          const data = await response.json();
          setEventDetails(data);
        } else {
          console.error('Hata oluştu:', response.statusText);
        }
      } catch (error) {
        console.error('Bir hata oluştu:', error);
      }
    };

    const fetchEventImageURL = async () => {
      try {
        const response = await axios.get(eventDetails?.url);

        if (response.status === 200) {
          const html = response.data;
          const $ = cheerio.load(html);

          const imgTags = $('img');
          imgTags.each((index, element) => {
            const src = $(element).attr('src');
            if (src && src.includes('https://www.biletix.com/static/images/live/event/eventimages')) {
              setEventImageURL(src);
              return false;
            }
          });
        } else {
          console.error('Resim URL alınamadı.');
        }
      } catch (error) {
        console.error('Hata:', error);
      }
    };

    const fetchAboutEvent = async () => {
      try {
        const response = await axios.get(eventDetails?.url);
    
        if (response.status === 200) {
          const html = response.data;
          const $ = cheerio.load(html);
    
          const aboutEventDiv = $('.current-text');
          const aboutEventText = aboutEventDiv.text();
          
          // aboutEventText'i kullanabilir veya başka bir işlem yapabilirsiniz
          console.log('current-text içeriği:', aboutEventText);
        } else {
          console.error('Event detayları alınamadı.');
        }
      } catch (error) {
        console.error('Hata:', error);
      }
    };
    

    fetchEventDetails();
    fetchEventImageURL();
    fetchAboutEvent()
  }, []);

  return (
    <View style={styles.eventDetailContainer}>
      {eventDetails ? (
        <View style={styles.details}>
          {eventImageURL ? (
            <Image
              source={{ uri: eventImageURL }}
              style={styles.eventCover}
            />
          ) : (
            <Text>Resim yükleniyor...</Text>
          )}
          
          <Text style={styles.dateTime}>{dayjs(eventDetails.dates.start.localDate).locale('tr').format('DD MMMM dddd')} {eventDetails.dates.start.localTime}</Text>
          <Text style={styles.title}>{eventDetails.name} @{eventDetails._embedded.venues[0].name}</Text>

          <FollowArtistCard
            name={eventDetails.name}
            followerCount={500}
            onPressFollow={() => {
              // Takip et butonuna basıldığında yapılacak işlemler
              
            }}
          />
          <Text style={styles.venue}>{eventDetails._embedded.venues[0].name}</Text>
          
          {/* <Text>Segment</Text>
          <Text>Genre</Text> */}
          <Text style={styles.venue} >Etkinlik hakkında</Text>
          <Text style={styles.venue}>Satışta mı?</Text>

          <Text style={styles.venue}>oturma planı</Text>
          <Text style={styles.venue}>bilet</Text>
          <Text style={styles.venue}>kategori-fiyat</Text>
        </View>
      ) : (
        <Text style={styles.venue}>Detaylar yükleniyor...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  eventDetailContainer: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: '#FAF9F6',
    
  },

  details: {
    flex:1,
    marginHorizontal: 5
    
  },

  eventCover: {
    width: '100%',
    height: '30%',
    alignSelf: 'center',
    objectFit: 'cover',
    borderWidth: 0,
    borderRadius: 10,
    marginBottom: 20,
  }, 

  dateTime: {
    
    
  },

  title: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 30, 
    
    
  },
  

  venue: {
    fontSize: 20,
    padding: 10,
    
    
  },


  

  dateInfo: {
    

  },

  timeInfo: {
    
  }

})

export default EventDetails;
