// import {
//   type Error as AdminOverviewError,
//   type AdminOverviewResponse,
//   getAdminOverview,
// } from '@/services/admin';
// import { useQuery } from '@tanstack/react-query';
// import { AxiosError } from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Card = ({
  children,
  className = '',
}) => (
  <div className={`flex-none bg-white rounded-xl shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({
  children,
  className = '',
}) => <div className={`p-6 py-3 ${className}`}>{children}</div>;

const CardTitle = ({
  children,
  className = '',
}) => (
  <h3 className={`text-base font-semibold text-black ${className}`}>
    {children}
  </h3>
);

const CardContent = ({
  children,
  className = '',
}) => <div className={`p-6 py-3 ${className}`}>{children}</div>;

const ProgressBar = ({
  value,
  gradient,
}) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div
      className={`h-2.5 rounded-full ${gradient}`}
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

export default function Overview() {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [activeBatch, setActiveBatch] = useState(null);

  // const {
  //   data: overviewData,
  //   isLoading,
  //   isError,
  //   error,
  //   refetch,
  // } = useQuery({
  //   queryKey: ['admin-overview'],
  //   queryFn: getAdminOverview,
  //   retry: false,
  // });

  // useEffect(() => {
  //   if (isError) {
  //     setShowErrorModal(true);
  //   }
  // }, [isError]);

  // const handleRetry = () => {
  //   setShowErrorModal(false);
  //   refetch();
  // };

  // if (!overviewData && isLoading) {
  //   return <div className="p-6">Loading...</div>;
  // }

  // const angkatanKeys = overviewData?.data?.angkatan
  //   ? Object.keys(overviewData.data.angkatan)
  //   : [];

  let donutChartData = [];

  // if (overviewData) {
  //   donutChartData = angkatanKeys.map((x) => ({
  //     name: x,
  //     value: overviewData.data.angkatan[x].count,
  //   }));

  //   const totalFromData = donutChartData.reduce(
  //     (acc, cur) => acc + cur.value,
  //     0
  //   );
  //   const totalExpected = overviewData.data.totalPendaftar;

  //   if (totalFromData < totalExpected) {
  //     donutChartData.push({
  //       name: 'Others',
  //       value: totalExpected - totalFromData,
  //     });
  //   }
  // }

  // const donutColors = ['#FDAD15', '#02CACD', '#818CF8', '#34D399'];

  // const lntClassesData = overviewData?.data?.lntClasses
  //   ? overviewData.data.lntClasses.map((x) => ({
  //       name: x.className.split(' ')[0],
  //       count: x.count,
  //     }))
  //   : [];

  return (
    <>
      {/* {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <h3 className="text-xl font-bold mb-4">Error</h3>
            <p className="text-gray-600 mb-6">
              {error?.response?.data?.error ||
                error?.message ||
                'An unknown error occurred.'}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowErrorModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={handleRetry}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )} */}

      <div className="py-6 space-y-7">
        <div className="flex flex-row gap-7 min-w-fit px-6">
          <Card className="col-span-1 row-span-1 w-[440px] h-[360px]">
            <CardHeader>
              <CardTitle>Registrants by Batch</CardTitle>
            </CardHeader>
            {/* <CardContent className="flex flex-col items-center justify-center h-[312px]">
              {isLoading ? (
                <div className="w-40 h-40 my-4 bg-gray-200 rounded-full animate-pulse"></div>
              ) : (
                <div className="relative w-40 h-40 my-4 transition-all duration-300 flex flex-col justify-between">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={70}
                        startAngle={90}
                        endAngle={450}
                        onMouseEnter={(data) =>
                          setActiveBatch(data.name)
                        }
                        onMouseLeave={() => setActiveBatch(null)}
                      >
                        {donutChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              activeBatch === null || activeBatch === entry.name
                                ? donutColors[index % donutColors.length]
                                : '#E5E7EB'
                            }
                            strokeWidth={0}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <AnimatePresence mode="wait">
                      {activeBatch ? (
                        <motion.div
                          key={activeBatch}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col items-center"
                        >
                          <span className="text-xs text-gray-500">
                            Total {activeBatch}
                          </span>
                          <span className="text-2xl font-bold text-gray-800">
                            {donutChartData
                              .find((d) => d.name === activeBatch)
                              ?.value.toLocaleString() ?? 0}
                          </span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="total"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col items-center"
                        >
                          <span className="text-xs text-gray-500">Total</span>
                          <span className="text-3xl font-bold text-gray-800">
                            {overviewData?.data.totalPendaftar.toLocaleString()}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
              <div className="flex justify-around w-full mt-4 text-center">
                {isLoading ? (
                  <div>
                    <div className="h-12 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-12 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ) : (
                  angkatanKeys.map((key) => (
                    <div
                      key={key}
                      className="flex flex-col items-center justify-center w-24"
                    >
                      <p className="text-sm text-gray-500 text-center">{`BINUSIAN ${key.substring(1)}`}</p>
                      <p className="text-xl font-bold text-center">
                        {overviewData?.data.angkatan[
                          key
                        ].count.toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent> */}
          </Card>
          <Card className="col-span-1 row-span-1 w-[540px] h-[360px]">
            <CardHeader>
              <CardTitle>LnT Classes</CardTitle>
            </CardHeader>
            {/* <CardContent>
              {isLoading ? (
                <div className="h-[312px] bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <ResponsiveContainer width="100%" height={288}>
                  {(() => {
                    const maxCount = lntClassesData.length
                      ? Math.max(...lntClassesData.map((item) => item.count))
                      : 0;
                    const yMax = Math.ceil(maxCount / 4) * 4 || 4;
                    return (
                      <BarChart
                        data={lntClassesData.map((item) => ({
                          ...item,
                          Count: item.count,
                        }))}
                        margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                      >
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10 }}
                          tickLine={false}
                          axisLine={false}
                          interval={0}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                          domain={[0, yMax]}
                          allowDecimals={false}
                        />
                        <Tooltip
                          cursor={{ fill: 'transparent' }}
                          contentStyle={{
                            background: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '0.5rem',
                          }}
                          labelFormatter={(label) => `Class: ${label}`}
                          formatter={(value) => [`${value}`, 'Count']}
                        />
                        <Bar
                          dataKey="Count"
                          fill="#818CF8"
                          radius={[4, 4, 0, 0]}
                          barSize={20}
                        />
                      </BarChart>
                    );
                  })()}
                </ResponsiveContainer>
              )}
            </CardContent> */}
          </Card>
          <Card className="col-span-1 row-span-2 w-[400px] h-[360px]">
            <CardHeader>
              <CardTitle>Top 3 Majors</CardTitle>
            </CardHeader>
            {/* <CardContent className="h-[312px] flex justify-center items-center">
              {isLoading ? (
                <div className="w-full flex flex-col gap-2">
                  <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-7">
                  {overviewData?.data.jurusan.top3.map((major, index) => (
                    <div
                      key={major.name}
                      className="flex justify-between items-center h-12 w-full px-8"
                    >
                      <div>
                        <p className="font-semibold text-black">{major.name}</p>
                        <p className="text-sm text-gray-500">
                          {major.count} Registrant
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 text-black">
                        <span className="font-bold">{index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent> */}
          </Card>
        </div>
        <div className="flex flex-row gap-7 min-w-fit px-6">
          <Card className="col-span-1 row-span-1 w-[550px] h-[180px]">
            <CardHeader>
              <CardTitle>Launching Progress</CardTitle>
            </CardHeader>
            {/* <CardContent className="h-[132px] w-full flex flex-col">
              {isLoading ? (
                <div className="w-full flex flex-col gap-3">
                  <div className="h-[42px] w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-[42px] w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-black">
                        Launched Members
                      </span>
                      <span className="text-gray-600">
                        <strong>
                          {overviewData?.data?.statusLaunching.percentage}%
                        </strong>
                        &nbsp; Registrant
                      </span>
                    </div>
                    <ProgressBar
                      value={
                        overviewData?.data?.statusLaunching.percentage ?? 0
                      }
                      gradient="bg-[linear-gradient(143.13deg,_#FFBF1A_5.36%,_#FF4080_94.64%)]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-black">
                        Progress Launching
                      </span>
                      <span className="text-gray-600">
                        <strong>
                          {overviewData?.data?.statusMember.percentage}%
                        </strong>
                        {''}
                        &nbsp; Registrant
                      </span>
                    </div>
                    <ProgressBar
                      value={overviewData?.data?.statusMember.percentage ?? 0}
                      gradient="bg-[linear-gradient(143.13deg,_#FFBF1A_5.36%,_#FF4080_94.64%)]"
                    />
                  </div>
                </div>
              )}
            </CardContent> */}
          </Card>
          <Card className="col-span-1 row-span-1 w-[550px] h-[180px]">
            <CardHeader>
              <CardTitle>Membership Status</CardTitle>
            </CardHeader>
            {/* <CardContent className="h-[132px] w-full flex flex-col justify-center items-center">
              {isLoading ? (
                <div className="w-full flex flex-col gap-3">
                  <div className="h-[42px] w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-[42px] w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-black">
                        Active Members
                      </span>
                      <span className="text-gray-600">
                        <strong>
                          {overviewData?.data?.statusLaunching.percentage}%
                        </strong>
                        {''}
                        &nbsp; Registrant
                      </span>
                    </div>
                    <ProgressBar
                      value={
                        overviewData?.data?.statusLaunching.percentage ?? 0
                      }
                      gradient="bg-[linear-gradient(270deg,_#2FEA9B_15.5%,_#7FDD53_85.5%)]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-black">
                        Registrant
                      </span>
                      <span className="text-gray-600">
                        <strong>
                          {overviewData?.data?.statusMember.percentage}%
                        </strong>
                        {''}
                        &nbsp; Registrant
                      </span>
                    </div>
                    <ProgressBar
                      value={overviewData?.data?.statusMember.percentage ?? 0}
                      gradient="bg-[linear-gradient(270deg,_#2FEA9B_15.5%,_#7FDD53_85.5%)]"
                    />
                  </div>
                </div>
              )}
            </CardContent> */}
          </Card>
        </div>
      </div>
    </>
  );
}
