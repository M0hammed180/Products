import React from "react";
import SalesChart from "../Chart1";
import TeamProgress from "../Chart2";

export default function Dashboard() {
  return (
    <div>
      <div className="flex overflow-hidden bg-gray-100 dark:bg-black">
        <div
          className="bg-gray-900 opacity-50 hidden fixed inset-0 z-10"
          id="sidebarBackdrop"
        ></div>

        <div
          id="main-content"
          className="relative h-full w-full overflow-y-auto bg-gray-100 dark:bg-black "
        >
          <main>
            <div className="pt-6 px-4">
              <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="rounded-3xl bg-white p-4 shadow dark:bg-zinc-900 sm:p-6 xl:p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl font-bold leading-none text-gray-900 dark:text-gray-100 sm:text-3xl">
                        2,340
                      </span>
                      <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
                        New products this week
                      </h3>
                    </div>
                    <div className="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                      14.6%
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-4 shadow dark:bg-zinc-900 sm:p-6 xl:p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl font-bold leading-none text-gray-900 dark:text-gray-100 sm:text-3xl">
                        5,355
                      </span>
                      <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Visitors this week
                      </h3>
                    </div>
                    <div className="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                      32.9%
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-4 shadow dark:bg-zinc-900 sm:p-6 xl:p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl font-bold leading-none text-gray-900 dark:text-gray-100 sm:text-3xl">
                        385
                      </span>
                      <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
                        User signups this week
                      </h3>
                    </div>
                    <div className="ml-5 w-0 flex items-center justify-end flex-1 text-red-500 text-base font-bold">
                      -2.7%
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-6 px- flex">
                <SalesChart />
                <TeamProgress shipped={20} notShipped={10} delivered={50} />
              </div>
              <div className="grid grid-cols-1 xl:gap-4 my-4">
                <div className="mb-4 h-full rounded-3xl bg-white p-4 shadow dark:bg-zinc-900 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-gray-100">
                      Latest Customers
                    </h3>
                    <a
                      href="#"
                      className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-3xl inline-flex items-center p-2"
                    >
                      View all
                    </a>
                  </div>
                  <div className="flow-root">
                    <ul
                      role="list"
                      className="divide-y divide-gray-200 dark:divide-zinc-700"
                    >
                      <li className="py-3 sm:py-4">
                        <div className="flex items-center space-x-4">
                          <div className="shrink-0">
                            <img
                              className="h-8 w-8 rounded-full"
                              src="https://demo.themesberg.com/windster/images/users/neil-sims.png"
                              alt="Neil image"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                              Neil Sims
                            </p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                              <a
                                href="/cdn-cgi/l/email-protection"
                                className="__cf_email__"
                                data-cfemail="17727a767e7b57607e7973646372653974787a"
                              >
                                [email&#160;protected]
                              </a>
                            </p>
                          </div>
                          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-gray-100">
                            $320
                          </div>
                        </div>
                      </li>
                      <li className="py-3 sm:py-4">
                        <div className="flex items-center space-x-4">
                          <div className="shrink-0">
                            <img
                              className="h-8 w-8 rounded-full"
                              src="https://demo.themesberg.com/windster/images/users/bonnie-green.png"
                              alt="Bonnie image"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                              Bonnie Green
                            </p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                              <a
                                href="/cdn-cgi/l/email-protection"
                                className="__cf_email__"
                                data-cfemail="d4b1b9b5bdb894a3bdbab0a7a0b1a6fab7bbb9"
                              >
                                [email&#160;protected]
                              </a>
                            </p>
                          </div>
                          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-gray-100">
                            $3467
                          </div>
                        </div>
                      </li>
                      <li className="py-3 sm:py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              className="h-8 w-8 rounded-full"
                              src="https://demo.themesberg.com/windster/images/users/michael-gough.png"
                              alt="Michael image"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                              Michael Gough
                            </p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                              <a
                                href="/cdn-cgi/l/email-protection"
                                className="__cf_email__"
                                data-cfemail="40252d21292c0037292e24333425326e232f2d"
                              >
                                [email&#160;protected]
                              </a>
                            </p>
                          </div>
                          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-gray-100">
                            $67
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
