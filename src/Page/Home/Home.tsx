import { useAppStore } from "../../Core/Store/AppStore";
import { useHomeActions } from "./useActionsHome";
import Section from "./Components/Section/Section";
import Swiper from "../../Components/Swiper/Swiper";
import AdditionalInfo from "./Components/AdditionalInfo/AdditionalInfo";
import "./Home.scss";
import { useEffect } from "react";
import { useAppModeStore } from "../../Core/Store/AppModeStore";

function Home() {
  const {
    setAppState,
    forState,
    additionalInfo,
    openSwiper,
    setOpenSwiper,
    setListStateClear,
    setUser,
  } = useAppStore();
  const { useMockData } = useAppModeStore();

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
    useMockData && setAppState("");
    useMockData && setUser("");
  }, []);

  useEffect(() => {
    // Находим контейнер с контентом
    const contentWrapper = document.querySelector(
      ".content_wrapper",
    ) as HTMLElement | null;
    const mainContent = document.querySelector(".main") as HTMLElement | null;;

    if (openSwiper) {
      // Блокируем скролл на контенте
      if (contentWrapper) {
        contentWrapper.style.overflow = "hidden";
        contentWrapper.style.touchAction = "none";
        contentWrapper.style.pointerEvents = "none"; // Блокируем клики
      }

      // Также блокируем main если нужно
      if (mainContent) {
        mainContent.style.overflow = "hidden";
        mainContent.style.touchAction = "none";
      }

      // Добавляем класс на body для дополнительной блокировки
      document.body.classList.add("home-swiper-open");
    } else {
      // Возвращаем скролл
      if (contentWrapper) {
        contentWrapper.style.overflow = "";
        contentWrapper.style.touchAction = "";
        contentWrapper.style.pointerEvents = "";
      }

      if (mainContent) {
        mainContent.style.overflow = "";
        mainContent.style.touchAction = "";
      }

      document.body.classList.remove("home-swiper-open");
    }

    return () => {
      // Очистка
      document.body.classList.remove("home-swiper-open");
    };
  }, [openSwiper]);

  return (
    <div className="main">
      {forState.length > 0 && (
        <>
          {openSwiper && <div className="overlay" onClick={closeSwiper} />}
          <div className={`content_wrapper ${openSwiper ? "blur" : ""}`}>
            {forState.map((section, i) => (
              <Section
                key={section.SectionKey || `section-${i}`}
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
