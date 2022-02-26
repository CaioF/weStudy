import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useModal } from "../../hooks";
import { Flex, Divider } from "@chakra-ui/react";
/* eslint-disable import/no-unresolved */
import { Swiper, SwiperSlide } from "swiper/react"; // https://github.com/import-js/eslint-plugin-import/issues/2266
import { Navigation } from "swiper";
import Card from "../../components/Card";
import { TimeSlider, Range, SelectForm } from "../../components/Form/";
import { Button } from "../../components/Button";
import { GroupForm } from "../../components/GroupForm";

/**
 * TODO:
 * call api to get user info, display user rating and num of user groups
 * call api to 'post' search groups, display groups in swiper
 * add button to open create groupmodal form
 * add labels and divider
 */

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
  const [groupSize, setGroupSize] = useState<String>("1");
  const [groupSubject, setGroupSubject] = useState<String>("Maths");
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
      setGroups(groups);
    });
  }, []);

  useEffect(() => {
    console.log(timeRange, groupSize, groupSubject);
  }, [timeRange, groupSize, groupSubject]);

  function onTimeChange(range: Range) {
    setTimeRange(range);
  }

  function onGroupSizeChange(value: String) {
    setGroupSize(value);
  }

  function onGroupSubjectChange(value: String) {
    setGroupSubject(value);
  }

  const outerCarouselStyle = {
    align: "center",
    textAlign: "center" as const, // https://github.com/typestyle/typestyle/issues/281
    justifyContent: "center",
    justify: "space-between",
  };

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

      <Divider />
      {/* TODO: add styles */}
      <Flex bgColor="gray.300 !important">
        <TimeSlider label="Session time" onChange={onTimeChange} />
        <SelectForm
          label="Subject"
          placeholder="Maths"
          options={["Maths", "Biology", "Bananas"]}
          onChange={onGroupSubjectChange}
        />
        <SelectForm
          label="Group Size"
          placeholder="1"
          options={["1", "2", "3", "4", "5"]}
          onChange={onGroupSizeChange}
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
