import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#26715f",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "#fbfaf7",
            borderRadius: 28,
            display: "flex",
            height: 112,
            justifyContent: "center",
            width: 112,
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "#ef8f68",
              borderRadius: 22,
              color: "#fbfaf7",
              display: "flex",
              fontSize: 56,
              fontWeight: 900,
              height: 72,
              justifyContent: "center",
              lineHeight: 1,
              width: 80,
            }}
          >
            家
          </div>
        </div>
      </div>
    ),
    size,
  );
}
