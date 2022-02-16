import { Flex } from '@chakra-ui/react';
/* eslint-disable import/no-unresolved */
import { Swiper, SwiperSlide } from 'swiper/react';
import Card from '../../components/Card';
import 'swiper/css';

export function Dashboard() {
  const dataList = [
    {
      id: '1',
      title: 'Group 1',
      summary: 'This is a summary, can be any length',
      date: '12/12/12',
      tasks: '7',
      participants: '7',
    },
    {
      id: '2',
      title: 'Group Two',
      summary:
        'Another summary, make sure that this is very responsivesfafsdfsdfsdfsdfsfsfsdf',
      date: '12/12/12',
      tasks: '7',
      participants: '7',
    },
    {
      id: '3',
      title: 'Group Three',
      summary: 'Finalize them summary, hurry, we are close to deadline',
      date: '12/12/12',
      tasks: '7',
      participants: '7',
    },
    {
      id: '4',
      title: 'Group 4',
      summary: 'This is a summary, can be any length',
      date: '12/12/12',
      tasks: '7',
      participants: '7',
    },
    {
      id: '5',
      title: 'Group 5',
      summary:
        'Another summary, make sure that this is very responsivesfafsdfsdfsdfsdfsfsfsdf',
      date: '12/12/12',
      tasks: '7',
      participants: '7',
    },
    {
      id: '6',
      title: 'Group 6',
      summary: 'Finalize them summary, hurry, we are close to deadline',
      date: '12/12/12',
      tasks: '7',
      participants: '7',
    },
  ];

  return (
    <Flex
      height={{ base: 'auto', md: '80vh' }}
      marginTop={{ base: '0', md: '-40px' }}
      width="100%"
      maxWidth="var(--maxWidth)"
      marginX="auto"
      padding="16px"
      bgColor="gray.300"
      filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25))"
      borderRadius="10px"
      justifyContent="center"
    >
      <Swiper
        spaceBetween={50}
        slidesPerView={3}
        onSlideChange={() => console.log('slide change')}
      >
        {dataList.map(function (data) {
          const { id, title, summary, date, tasks, participants } = data;
          return (
            <SwiperSlide key={id}>
              <Card
                title={title}
                summary={summary}
                date={date}
                tasks={tasks}
                participants={participants}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Flex>
  );
}
