import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import History from "@/components/partials/widget/chart/history";
import RadarChart from "@/components/partials/widget/chart/radar-chart";

// image import
import Usa from "@/assets/images/flags/usa.svg";
import Brasil from "@/assets/images/flags/bra.svg";
import Japan from "@/assets/images/flags/japan.svg";
import Italy from "@/assets/images/flags/italy.svg";
import Chin from "@/assets/images/flags/chin.svg";
import India from "@/assets/images/flags/india.svg";
import Earnings from "@/components/partials/widget/chart/Earnings";
import RecentOrderTable from "@/components/partials/Table/order-table";

const country = [
  {
    name: "Usa",
    flag: Usa,
    count: "$6.41",
    icon: "heroicons:arrow-small-up",
  },
  {
    name: "Brazil",
    flag: Brasil,
    count: "$2.33",
    icon: "heroicons:arrow-small-up",
  },
  {
    name: "Japan",
    flag: Japan,
    count: "$7.12",
    icon: "heroicons:arrow-small-down",
  },
  {
    name: "Italy",
    flag: Italy,
    count: "$754",
    icon: "heroicons:arrow-small-down",
  },
  {
    name: "India",
    flag: India,
    count: "$699",
    icon: "heroicons:arrow-small-up",
  },
  {
    name: "India",
    flag: India,
    count: "$624",
    icon: "heroicons:arrow-small-up",
  },
];
const source = [
  {
    name: "Direct Source",
    flag: "ph:circle-half",
    count: "1.2k",
    icon: "heroicons:arrow-small-down",
  },
  {
    name: "Social Network",
    flag: "ph:share-network",
    count: "0.33k",
    icon: "heroicons:arrow-small-down",
  },
  {
    name: "Email Newsletter",
    flag: "ph:chat-text",
    count: "31.12k",
    icon: "heroicons:arrow-small-up",
  },
  {
    name: "Referrals",
    flag: "ph:arrow-square-out",
    count: "890",
    icon: "heroicons:arrow-small-down",
  },
  {
    name: "ADVT",
    flag: "ph:percent",
    count: "765",
    icon: "heroicons:arrow-small-up",
  },
  {
    name: "Other",
    flag: "ph:star-four",
    count: "3.4k",
    icon: "heroicons:arrow-small-up",
  },
];

const Dashboard = () => {
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
        <Card>
          <div>
            <div className="flex">
              <div className="flex-1 text-base font-medium">Orders</div>
              <div className="flex-none">
                <div className="h-10 w-10  rounded-full bg-green-500 text-white text-2xl flex items-center justify-center">
                  <Icon icon="ph:shopping-cart" />
                </div>
              </div>
            </div>
            <div>
              <span className=" text-2xl font-medium text-gray-800  dark:text-white">
                600
              </span>
              <span className="  space-x-2 block mt-4 ">
                <span className="badge bg-green-500/10 text-green-500 ">
                  6.77%
                </span>
                <span className=" text-sm text-gray-500 dark:text-gray-400">
                  Since last week
                </span>
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <div className="card-title mb-5">Latest Order</div>
        <RecentOrderTable />
      </div>
    </div>
  );
};

export default Dashboard;
