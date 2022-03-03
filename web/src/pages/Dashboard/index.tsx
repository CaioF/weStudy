import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useModal } from "../../hooks";
import { Flex, Divider } from "@chakra-ui/react";
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

/**
 * TODO:
 * call api to get user info, display user rating and num of user groups
 * call api to 'post' search groups, display groups in swiper
 * add button to open create groupmodal form
 * add labels and divider
 */

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
  members: number;
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
  justify: "space-between",
};

function formatTime(time: number) {
  return `${String(time).padStart(2, '0')}:00`
}

export function Dashboard() {
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [searchGroups, setSearchGroups] = useState<Group[]>([]);
  const [sessionTime, setSessionTime] = useState<Range>({ start: 8, end: 15 });
  const [subject, setSubject] = useState('Maths');
  const [timezone, setTimezone] = useState('Europe/London');
  const [groupSize, setGroupSize] = useState(5);
  const { openModal } = useModal();

  useEffect(() => {
    api.get("/api/userGroups").then((res) => {
      const groups = res.data.map((group: GroupResponse) => {
        return {
          id: group.id,
          name: group.name,
          description: group.description,
          members: group.size - (group.availibleSpots - 1),
          dateCreated: group.dateCreated,
        };
      });
      setUserGroups(groups);
    });
  }, []);

  useEffect(() => {
    api.post("/api/userGroups/find", {
      "day": "Sunday",
      "startTime": `${sessionTime.start}:00`,
      "endTime": `${sessionTime.end}:00`,
      "subject": subject,
      "groupSize": groupSize,
      "timezone": timezone,
    }).then((res) => {
      const groups = res.data.map((group: GroupResponse) => {
        if(group.availibleSpots > 1) {
          return {
            id: group.id,
            name: group.name,
            description: group.description,
            members: group.size - (group.availibleSpots - 1),
            dateCreated: group.dateCreated,
          };
        }
      });
      setSearchGroups(groups);
    });
    }, [sessionTime.start, sessionTime.end, subject, groupSize, timezone]);

  return (
    <Flex
      height={{ base: "auto", md: "80vh" }}
      marginTop={{ base: "0", md: "-40px" }}
      width="100%"
      maxWidth="var(--maxWidth)"
      marginX="auto"
      bgColor="gray.300"
      filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25))"
      borderRadius="10px"
      justify="flex-start"
      flexDirection="column"
    >
      {/* TODO: add user info, top left */}
      <Flex>
        <Button
          flexGrow={1}
          flexShrink={0}
          onClick={() => openModal(<GroupForm action="create" />)}
          bgColor="green.300"
        >
          Create Group
        </Button>
      </Flex>
      <div style={outerCarouselStyle}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={3}
          navigation
          // onSwiper={swiper => console.log(swiper)}
          // onSlideChange={() => console.log('slide change')}
        >
          {userGroups.map(function (data) {
            const { id, name, description, dateCreated, members } = data;
            return (
              <SwiperSlide key={id}>
                {({isNext}) => (
                  <Card
                    id={id}
                    title={name}
                    summary={description}
                    date={dateCreated}
                    participants={members}
                    isUserGroup={true}
                    isNextCard={isNext}
                  />
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <Divider />
      {/* TODO: add styles */}
      <Flex bgColor="gray.300 !important">
        <SelectForm
          id="topic"
          label="Topic"
          placeholder="select"
          options={topics}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <SelectForm
          id="groupSize"
          label="Group size"
          placeholder="select"
          options={groupSizes}
          value={groupSize}
          onChange={(e) => setGroupSize(Number(e.target.value))}
        />

        <SelectForm
          id="timezone"
          label="Timezone"
          placeholder="select"
          options={timezones}
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        />

        <TimeSlider
          label="Session time"
          onChange={setSessionTime}
          start={sessionTime.start}
          end={sessionTime.end}
        />
      </Flex>
      <div>
        <Swiper
          modules={[Navigation]}
          spaceBetween={50}
          slidesPerView={3}
          navigation
          // onSwiper={swiper => console.log(swiper)}
          // onSlideChange={() => console.log('slide change')}
        >
          {searchGroups.map(function (data) {
            const { id, name, description, dateCreated, members } = data;
            return (
              <SwiperSlide key={id}>
                {({isNext}) => (
                  <Card
                    id={id}
                    title={name}
                    summary={description}
                    date={dateCreated}
                    participants={members}
                    isUserGroup={false}
                    isNextCard={isNext}
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
