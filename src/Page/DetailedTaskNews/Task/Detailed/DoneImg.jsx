import React from "react";

function DoneImg({ done }) {
  return (
    <div
    // style={{
    //   width: "28px",
    //   height: "28px",
    // }}
    >
      {done ? (
        <span class="material-symbols-outlined" style={{ color: "#4fae1a " }}>
          done_outline
        </span>
      ) : (
        <span class="material-symbols-outlined" style={{ color: "red " }}>
          close
        </span>
      )}
    </div>
  );
}

export default DoneImg;
