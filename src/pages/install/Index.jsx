import React from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import PastInstallations from "../../components/install/pastInstallations";
import UpcomingInstallations from "../../components/install/upcomingInstallations";
import AwaitingInstallationSchedule from "../../components/install/awaitingInstallationSchedule";

const Install = () => {
  return (
    <div className=" space-y-5">
      <div className="grid xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5">
        <Card>
          <div>
            <div className="flex">
              <div className="flex-1 text-base font-medium">Sales</div>
              <div className="flex-none">
                <div className="h-10 w-10  rounded-full bg-indigo-500 text-white text-2xl flex items-center justify-center">
                  <Icon icon="ph:car" />
                </div>
              </div>
            </div>
            <div>
              <span className=" text-2xl font-medium text-gray-800  dark:text-white">
                2.382
              </span>
              <span className="  space-x-2 block mt-4 ">
                <span className="badge bg-indigo-500/10 text-indigo-500 ">
                  3.65%
                </span>
                <span className=" text-sm text-gray-500 dark:text-gray-400">
                  Since last week
                </span>
              </span>
            </div>
          </div>
        </Card>
        <Card>
          <div>
            <div className="flex">
              <div className="flex-1 text-base font-medium">Earnings</div>
              <div className="flex-none">
                <div className="h-10 w-10  rounded-full bg-yellow-500 text-white text-2xl flex items-center justify-center">
                  <Icon icon="ph:currency-dollar" />
                </div>
              </div>
            </div>
            <div>
              <span className=" text-2xl font-medium text-gray-800  dark:text-white">
                $21.300
              </span>
              <span className="  space-x-2 block mt-4 ">
                <span className="badge bg-yellow-500/10 text-yellow-500 ">
                  4.44%
                </span>
                <span className=" text-sm text-gray-500 dark:text-gray-400">
                  Since last week
                </span>
              </span>
            </div>
          </div>
        </Card>
        <Card>
          <div>
            <div className="flex">
              <div className="flex-1 text-base font-medium">Visitors</div>
              <div className="flex-none">
                <div className="h-10 w-10  rounded-full bg-red-500 text-white text-2xl flex items-center justify-center">
                  <Icon icon="ph:user-switch" />
                </div>
              </div>
            </div>
            <div>
              <span className=" text-2xl font-medium text-gray-800  dark:text-white">
                14.212
              </span>
              <span className="  space-x-2 block mt-4 ">
                <span className="badge bg-red-500/10 text-red-500 ">5.25%</span>
                <span className=" text-sm text-gray-500 dark:text-gray-400">
                  Since last week
                </span>
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <PastInstallations />
        <UpcomingInstallations />
        <AwaitingInstallationSchedule />
      </div>
    </div>
  );
};

export default Install;
