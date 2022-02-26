import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Flex } from '@chakra-ui/react';
/* eslint-disable import/no-unresolved */
import { Swiper, SwiperSlide, useSwiperSlide } from 'swiper/react'; // https://github.com/import-js/eslint-plugin-import/issues/2266
import { Navigation } from 'swiper';
import Card from '../../components/Card';
import { TimeSlider, Range } from '../../components/Form/';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  dateCreated: Date;
  // timeRange: Array<number>;
}

interface GroupResponse {
  id: string;
  name: string;
  description: string;
  members: number;
  dateCreated: Date;
  availibleSpots: number;
  size: number;
  timeRanges: [string, number, number];
  timeZone: string;
}

export function Dashboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [timeRange, setTimeRange] = useState<Range>({ start: 9, end: 12 });

  useEffect(() => {
    api.get('/api/userGroups').then(res => {
      const groups = res.data.map((group: GroupResponse) => {
        return {
          id: group.id,
          name: group.name,
          description: group.description,
          members: group.size-(group.availibleSpots-1),
          dateCreated: group.dateCreated,
        }
      })
      setGroups(groups);
    });
    
  }, []);

  useEffect(() => {
    api.get('api/userGroups/find')
  }, [timeRange]);

  function onTimeChange(range: Range){
    setTimeRange(range);
  }

  const outerCarouselStyle = {
    align: 'center',
    textAlign: 'center' as const, // https://github.com/typestyle/typestyle/issues/281
    justifyContent: 'center',
    justify: 'space-between',
  };

  return (
    <Flex
      height={{ base: 'auto', md: '80vh' }}
      marginTop={{ base: '0', md: '-40px' }}
      width="100%"
      maxWidth="var(--maxWidth)"
      marginX="auto"
      bgColor="gray.300"
      filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25))"
      borderRadius="10px"
      justify="flex-start"
      flexDirection="column"
    >
      <div style={outerCarouselStyle}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={3}
          navigation
          // onSwiper={swiper => console.log(swiper)}
          // onSlideChange={() => console.log('slide change')}
        >
          {groups.map(function (data) {
            const { id, name, description, dateCreated, members } = data;
            return (
              <SwiperSlide key={id}>
                
                  <Card
                  id={id}
                  title={name}
                  summary={description}
                  date={dateCreated}
                  participants={members}
                  isUserGroup={true}
                />
                
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <div>
        <TimeSlider onChange={onTimeChange}/>
        
        <Swiper
          modules={[Navigation]}
          spaceBetween={50}
          slidesPerView={3}
          navigation
          // onSwiper={swiper => console.log(swiper)}
          // onSlideChange={() => console.log('slide change')}
        >

          {groups.map(function (data) {
            const { id, name, description, dateCreated, members } = data;
            return (
              <SwiperSlide key={id}>

                <Card
                  id={id}
                  title={name}
                  summary={description}
                  date={dateCreated}
                  participants={members}
                  isUserGroup={false}
                />
                
              </SwiperSlide>
            );

          })}

        </Swiper>
      </div>
    </Flex>
  );
}
