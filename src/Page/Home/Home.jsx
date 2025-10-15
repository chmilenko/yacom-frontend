import React, { useContext, useEffect } from "react";
import "./Home.scss";
import Section from "./Components/Section/Section";
import Swiper from "../../Components/Swiper/Swiper";
import AdditionalInfo from "./Components/AdditionalInfo/AdditionalInfo";

import { AppStateContext } from "../../Core/Context/AppStateContext";
import Button from "../../Ui/Button/Button";
import { useHomeActions } from "./useActionsHome";

function Home() {
  const {
    setUser,
    user,
    forState,
    additionalInfo,
    setAppState,
    openSwiper,
    setOpenSwiper,
    setListStateClear,
  } = useContext(AppStateContext);

  const {
    openTasksOrNewsForm,
    handleOpenSwiper,
    onTaskExecute,
    taskFulfill,
    openReport,
  } = useHomeActions();

  const closeSwiper = () => {
    openSwiper && setOpenSwiper(false);
    setListStateClear();
  };

  const CustomHeader = ({ title }) => {
    return (
      <div className="custom_header">
        <div className="swiper_header">{title}</div>

        {additionalInfo &&
          (additionalInfo.ResultType || additionalInfo.isReport) &&
          user.isExpert && (
            <div>
              <Button
                icon={
                  <span className="material-symbols-outlined">chart_data</span>
                }
                onClick={openReport}
                type="report"
              />
            </div>
          )}
      </div>
    );
  };

  useEffect(() => {
    setAppState();
    setUser();
  }, []);

  return (
    <div className="main">
      {forState.length > 0 && (
        <>
          {openSwiper && <div className="overlay" onClick={closeSwiper} />}

          <div className={`content_wrapper ${openSwiper ? "blur" : ""}`}>
            {forState.map((section) => (
              <Section
                key={section.TaskID || section.ObjectID}
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
