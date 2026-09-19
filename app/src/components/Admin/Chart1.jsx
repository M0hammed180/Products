import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const SalesChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const getBrandColor = () => {
      const computedStyle = getComputedStyle(document.documentElement);

      return (
        computedStyle.getPropertyValue("--color-fg-brand").trim() || "#1447E6"
      );
    };

    const getBrandSecondaryColor = () => {
      const computedStyle = getComputedStyle(document.documentElement);

      return (
        computedStyle.getPropertyValue("--color-fg-brand-subtle").trim() ||
        "#1447E6"
      );
    };

    const brandColor = getBrandColor();
    const brandSecondaryColor = getBrandSecondaryColor();

    const options = {
      series: [
        {
          name: "Developer Edition",
          data: [1500, 1418, 1456, 1526, 1356, 1256, 1400],
          color: brandColor,
        },
        {
          name: "Designer Edition",
          data: [643, 413, 765, 412, 1423, 1731, 1500],
          color: brandSecondaryColor,
        },
      ],

      chart: {
        height: "100%",
        maxWidth: "100%",
        type: "area",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },

      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },

      legend: {
        show: false,
      },

      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: "#1447E6",
          gradientToColors: ["#1447E6"],
        },
      },

      dataLabels: {
        enabled: false,
      },

      stroke: {
        width: 6,
      },

      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: 0,
        },
      },

      xaxis: {
        categories: [
          "01 February",
          "02 February",
          "03 February",
          "04 February",
          "05 February",
          "06 February",
          "07 February",
        ],

        labels: {
          show: false,
        },

        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },
      },

      yaxis: {
        show: false,

        labels: {
          formatter: (value) => {
            return "$" + value;
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
    <div className="w-8/12 px-2">
      <div className="h-auto w-full rounded-3xl bg-zinc-900 py-6 text-white shadow-xs overflow-hidden">
        {/* Header */}
        <div className="flex justify-between px-5">
          <div>
            <h5 className="text-2xl font-bold text-heading">$12,423</h5>

            <p className="text-body">Sales this week</p>
          </div>

          {/* Percentage */}
          <div className="flex items-center px-2.5 py-0.5 font-medium text-fg-success text-center">
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v13m0-13 4 4m-4-4-4 4"
              />
            </svg>
            12%
          </div>
        </div>

        {/* Chart */}
        <div ref={chartRef} className="h-41 w-full" />

        {/* Bottom */}
        <div className="grid grid-cols-1 items-center border-zinc-700 border-t bg-zinc-900/40 backdrop-blur-lg justify-between px-5 z-10">
          <div className="flex justify-between items-center pt-4 md:pt-6">
            {/* Dropdown */}
            <button
              type="button"
              className="text-sm font-medium text-body hover:text-heading text-center inline-flex items-center"
            >
              Last 7 days
              <svg
                className="w-4 h-4 ms-1.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 9-7 7-7-7"
                />
              </svg>
            </button>

            {/* Progress */}
            <a
              href="#"
              className="inline-flex items-center text-fg-brand bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm px-3 py-2 focus:outline-none"
            >
              Progress report
              <svg
                className="w-4 h-4 ms-1.5 -me-0.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 12H5m14 0-4 4m4-4-4-4"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
