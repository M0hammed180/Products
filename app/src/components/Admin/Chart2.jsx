import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";

const TeamProgress = ({ shipped, notShipped, delivered }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const getCSSVariable = (variable, fallback) => {
      const computedStyle = getComputedStyle(document.documentElement);

      return computedStyle.getPropertyValue(variable).trim() || fallback;
    };

    const brandColor = getCSSVariable("--color-fg-brand", "#1447E6");

    const warningColor = getCSSVariable("--color-warning", "#F59E0B");

    const successColor = getCSSVariable("--color-success", "#22C55E");

    const neutralSecondaryMediumColor = getCSSVariable(
      "--color-neutral-secondary-medium",
      "#E5E7EB",
    );

    const options = {
      series: [shipped, notShipped, delivered],

      colors: [brandColor, warningColor, successColor],

      chart: {
        height: "100%",
        width: "100%",
        type: "radialBar",

        sparkline: {
          enabled: true,
        },
      },

      plotOptions: {
        radialBar: {
          track: {
            background: neutralSecondaryMediumColor,
          },

          dataLabels: {
            show: false,
          },

          hollow: {
            margin: 0,
            size: "32%",
          },
        },
      },

      grid: {
        show: false,

        strokeDashArray: 4,

        padding: {
          left: 2,
          right: 2,
          top: -20,
          bottom: 0,
        },
      },

      labels: ["Shipped", "Not Shipped", "Delivered"],

      legend: {
        show: true,
        position: "bottom",
        offsetY: -20,
        labels: {
          colors: ["white", "white", "white"],
        },
        fontFamily: "Inter, sans-serif",
      },

      tooltip: {
        enabled: true,

        x: {
          show: false,
        },
      },

      yaxis: {
        show: false,

        labels: {
          formatter: (value) => {
            return value + "%";
          },
        },
      },
    };

    if (chartRef.current) {
      const chart = new ApexCharts(chartRef.current, options);

      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, []);

  return (
    <div className="md:w-4/12 px-5">
      <div className=" px-2 w-full bg-zinc-900 text-white rounded-3xl shadow-xs p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between mb-4 ">
          <div className="flex items-center">
            <div className="flex justify-center items-center">
              <h5 className="text-xl font-semibold text-heading">Orders</h5>
            </div>
          </div>
        </div>

        {/* Statistics */}

        {/* Radial Chart */}
        <div ref={chartRef} className="h-60 " />
      </div>
    </div>
  );
};

export default TeamProgress;
