import React from "react";

const houses = Array.from({ length: 12 }, (_, i) => i + 1);

const VedicChartDisplay = ({ data }: { data: any }) => {
  const width = 400;
  const height = 400;
  const cx = width / 2;
  const cy = height / 2;
  const r = 160;

  const angleOffset = Math.PI / 6;

  const getCoordinates = (index: number, offset = 0) => {
    const angle = (2 * Math.PI * index) / 12 - angleOffset;
    return {
      x: cx + (r - offset) * Math.cos(angle),
      y: cy + (r - offset) * Math.sin(angle),
    };
  };

  return (
    <svg width={width} height={height}>
      <circle cx={cx} cy={cy} r={r} fill="#f9fafb" stroke="#333" strokeWidth={2} />
      {houses.map((house, i) => {
        const { x, y } = getCoordinates(i, 20);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" fontSize="12" fill="#111">
            {house}
          </text>
        );
      })}

      {/* Render planets in each house */}
      {data?.houses?.map((houseData: any, index: number) => {
        const { x, y } = getCoordinates(index, 40);
        return (
          <text
            key={index}
            x={x}
            y={y}
            textAnchor="middle"
            fontSize="10"
            fill="#008080"
          >
            {houseData.planets?.join(", ")}
          </text>
        );
      })}
    </svg>
  );
};

export default VedicChartDisplay;
