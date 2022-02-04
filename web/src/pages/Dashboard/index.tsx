import { ChakraProvider, SimpleGrid, Container } from '@chakra-ui/react';
import Card from '../../components/Card';

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
  ];

  return (
    <ChakraProvider>
      <Container maxW="80rem" centerContent>
        <SimpleGrid columns={3}>
          {dataList.map(function (data) {
            const { id, title, summary, date, tasks, participants } = data;
            return (
              <Card
                key={id}
                title={title}
                summary={summary}
                date={date}
                tasks={tasks}
                participants={participants}
              />
            );
          })}
        </SimpleGrid>
      </Container>
    </ChakraProvider>
  );
}
