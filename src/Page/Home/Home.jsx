import { useEffect } from "react";
import { useAppStore } from "../../Core/Context/AppStateContext";
import { useHomeActions } from "./useActionsHome";
import Section from "./Components/Section/Section";
import Swiper from "../../Components/Swiper/Swiper";
import AdditionalInfo from "./Components/AdditionalInfo/AdditionalInfo";
import "./Home.scss";

function Home() {
  const {
    forState,
    additionalInfo,
    setAppState,
    openSwiper,
    setOpenSwiper,
    setListStateClear,
  } = useAppStore();

  const { openTasksOrNewsForm, handleOpenSwiper, onTaskExecute, taskFulfill } =
    useHomeActions();

  const closeSwiper = () => {
    openSwiper && setOpenSwiper(false);
    setListStateClear();
  };

  const CustomHeader = ({ title }) => {
    return <div className="swiper_header">{title}</div>;
  };

  useEffect(() => {
    setAppState();
  }, []);
  console.log(window.pageComponent);

  return (
    <div className="main">
      {forState.length > 0 && (
        <>
          {openSwiper && <div className="overlay" onClick={closeSwiper} />}
          <div className={`content_wrapper ${openSwiper ? "blur" : ""}`}>
            {forState.map((section, i) => (
              <Section
                key={section.TaskID || section.ObjectID || `section-${i}`}
                section={section}
                onOpenSwiper={handleOpenSwiper}
                openSectionForm={openTasksOrNewsForm}
                type={section.SectionName}
              />
            ))}
          </div>
        </>
      )}

      {openSwiper && (
        <Swiper
          closeSwiper={closeSwiper}
          header={
            <CustomHeader
              title={additionalInfo?.Header || additionalInfo?.Title}
            />
          }
        >
          <AdditionalInfo
            onTaskExecute={onTaskExecute}
            taskFulfill={taskFulfill}
          />
        </Swiper>
      )}
    </div>
  );
}

export default Home;
