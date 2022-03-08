import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useModal } from "../../hooks";
import { Flex, Divider, Box, useBreakpointValue, Text, Stack } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react"; // https://github.com/import-js/eslint-plugin-import/issues/2266
import { Navigation } from "swiper";
import Card from "../../components/Card";
import { TimeSlider, SelectForm, Range } from "../../components/Form/";
import { Button } from "../../components/Button";
import { GroupForm } from "../../components/GroupForm";
import { timezones } from "../../util/timezones";
import { groupSizes } from "../../util/groupSizes";
import { topics } from "../../util/topics";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  dateCreated: Date;
}

interface GroupResponse {
  id: string;
  name: string;
  description: string;
  dateCreated: Date;
  availibleSpots: number;
  size: number;
  timeRanges: [string, number, number];
  timeZone: string;
}

const outerCarouselStyle = {
  align: "center",
  textAlign: "center" as const, // https://github.com/typestyle/typestyle/issues/281
  justifyContent: "center",
  justify: "center",
};

function formatTime(time: number) {
  return `${String(time).padStart(2, '0')}:00`
}

export function Dashboard() {
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [searchGroups, setSearchGroups] = useState<Group[]>([]);
  const [sessionTime, setSessionTime] = useState<Range>({ start: 8, end: 15 });
  const [subject, setSubject] = useState("");
  const [timezone, setTimezone] = useState("");
  const [groupSize, setGroupSize] = useState(0);
  const { openModal } = useModal();
  const slidesPerView = useBreakpointValue({ base: 1, md: 3 })

  useEffect(() => {
    api.get("/api/userGroups").then((res) => {
      const groups = res.data.map((group: GroupResponse) => {
        return {
          id: group.id,
          name: group.name,
          description: group.description,
          members: (group.size-group.availibleSpots==0)?1:group.size-group.availibleSpots,
          dateCreated: group.dateCreated,
        };
      });
      setUserGroups(groups);
    });
  }, []);

  useEffect(() => {
    try {
      api.post("/api/userGroups/find", {
        "day": "Sunday",
        "startTime": `${sessionTime.start}:00`,
        "endTime": `${sessionTime.end}:00`,
        "subject": subject || "Maths",
        "groupSize": groupSize || "3",
        "timezone": timezone || "Singapore",
      }).then((res) => {
        const groups = res.data.map((group: GroupResponse) => {
          if(group.availibleSpots >= 1) {
            return {
              id: group.id,
              name: group.name,
              description: group.description,
              members: (group.size-group.availibleSpots==0)?1:group.size-group.availibleSpots,
              dateCreated: group.dateCreated,
            };
          }
        });
        setSearchGroups(groups);
        });
    } catch (error) {
      // pass
    }
  }, [sessionTime.start, sessionTime.end, subject, groupSize, timezone]);

  return (
    <Flex
      height={{ base: "auto", md: "80vh" }}
      marginTop={{ base: "0", md: "-40px" }}
      width="100%"
      maxWidth="var(--maxWidth)"
      marginX="auto"
      bgColor="gray.300"
      borderRadius="10px"
      justify="flex-start"
      flexDirection="column"
      p="24px"
      filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25))"
    >
      <Flex justify={{base: 'center', md: "space-between"}} alignItems="center" mb="32px" flexDirection={{base: 'column', md: 'row'}}>
        <Stack order={{base: 2, md: 1}} direction="row" spacing="24px">
          <Flex flexDirection="column" alignItems="center">
            <Text fontSize="32px" color="green.300">{`${localStorage.getItem("@weStudy:rating")}/5`}</Text>
            <Text mt="-8px" color="gray.500">Your rating</Text>
          </Flex>

          <Flex flexDirection="column" alignItems="center">
            <Text fontSize="32px" color="green.300" >{userGroups.length}</Text>
            <Text mt="-8px" color="gray.500">Groups</Text>
          </Flex>
        </Stack>

        <Text order={{base: 1, md: 2}} color="blue.900" fontSize="24px">Your groups</Text>

        <Flex mt={{base: "16px", md: 0 }} order={{base: 3, md: 3}} width={{base: "100%", md: 'fit-content'}}>
            <Button
              flexGrow={1}
              flexShrink={0}
              onClick={() => openModal(<GroupForm action="create" />)}
              bgColor="green.300"
            >
            Create Group
          </Button>
        </Flex>
      </Flex>

      <div style={outerCarouselStyle}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={slidesPerView}
          loop={false}
          centeredSlides={true}
          navigation
          style={{height: "15rem", paddingTop: "0.5rem"}}
          
          // onSwiper={swiper => console.log(swiper)}
          // onSlideChange={() => console.log('slide change')}
        >
          {userGroups.map(function (data) {
            const { id, name, description, dateCreated, members } = data;
            return (
              <SwiperSlide style={{filter: "drop-shadow(0 0 0.3rem rgba(0, 0, 0, 0.2))"}} key={id}>
                {({isActive}) => (
                  <Card
                    id={id}
                    title={name}
                    summary={description}
                    date={dateCreated}
                    participants={members}
                    isUserGroup={true}
                    isActiveCard={isActive}
                    // isActiveCard={userGroups.length > 3 ? isActive : true}
                  />
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <Box margin="2rem">
        <Divider />
      </Box>

      {/* TODO: add styles */}
      <Flex justify="space-between" bgColor="gray.300"  mb="32px">
        
        <Flex>
          <Box width="10rem" paddingRight="1rem">
            <SelectForm
              id="topic"
              placeholder="Subject"
              options={topics}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Box>

          <Box width="10rem">
            <SelectForm
              id="groupSize"
              placeholder="Group Size"
              options={groupSizes}
              value={groupSize}
              onChange={(e) => setGroupSize(Number(e.target.value))}
            />
          </Box>
        </Flex>

        <Box>
          <Text color="blue.900" fontSize="24px">Discover new Groups</Text>
        </Box>

        <Flex>
          <Box width="15rem" paddingRight="1rem">
            <TimeSlider
                label="Session time"
                onChange={setSessionTime}
                start={sessionTime.start}
                end={sessionTime.end}
              />
          </Box>

          <Box width="8rem">
            <SelectForm
              id="timezone"
              placeholder="Timezone"
              options={timezones}
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            />
          </Box>
        </Flex>


      </Flex>
      <div>
        <Swiper
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={slidesPerView}
          loop={false}
          centeredSlides={true}
          navigation
          style={{height: "15rem", paddingTop: "0.5rem"}}
          // onSwiper={swiper => console.log(swiper)}
          // onSlideChange={() => console.log('slide change')}
        >
          {searchGroups.map(function (data) {
            const { id, name, description, dateCreated, members } = data;
            return (
              <SwiperSlide style={{filter: "drop-shadow(0 0 0.3rem rgba(0, 0, 0, 0.2))"}} key={id}>
                {({isActive}) => (
                  <Card
                    id={id}
                    title={name}
                    summary={description}
                    date={dateCreated}
                    participants={members}
                    isUserGroup={false}
                    isActiveCard={isActive}
                    // isActiveCard={searchGroups.length > 3 ? isActive : true}
                  />
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </Flex>
  );
}
