import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BNCC from '../../assets/images/BNCC.png';
import IconCard from '../../assets/icons/IconCard.svg';
import IconCheckList from '../../assets/icons/IconChecklist.svg';
import IconMail from '../../assets/icons/IconMail.svg';
import IconPieChart from '../../assets/icons/IconPiechart.svg';
import IconTrophy from '../../assets/icons/IconTrophyV2.svg';
import IconUsers from '../../assets/icons/IconUsers.svg';

// import {
//   type AdminNameError,
//   type AdminNameResponse,
//   getName,
// } from '@/services/admin';
// import type { AxiosError } from 'axios';
// import { useQuery } from '@tanstack/react-query';
// import NotFound from '../NotFound';

const navItems = [
    {
        path: '/admin/overview',
        name: 'Overview',
        icon: IconPieChart,
    },
    {
        path: '/admin/users',
        name: 'User Details',
        icon: IconUsers,
    },
    {
        path: '/admin/documents',
        name: 'Documents',
        icon: IconMail,
    },
    {
        path: '/admin/payment',
        name: 'Payment',
        icon: IconCard,
    },
    {
        path: '/admin/japres',
        name: 'Jalur Prestasi',
        icon: IconTrophy,
    },
    {
        path: '/admin/subscription',
        name: 'Subscription',
        icon: IconCheckList,
    },
];

const adminNameDict = {
    ALS: 'Alam Sutera',
    BDG: 'Bandung',
    KMG: 'Kemanggisan',
    MLG: 'Malang',
    SUPER: 'All Region',
};

export default function Dashboard() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    //   const navigate = useNavigate();

    //   const token = localStorage.getItem('token');

    //   const {
    //     data: adminNameData,
    //     isLoading,
    //     isError,
    //   } = useQuery({
    //     queryKey: ['adminName'],
    //     queryFn: getName,
    //     retry: false,
    //     gcTime: 0,
    //     staleTime: 0,
    //     refetchOnMount: true,
    //   });

    //   useEffect(() => {
    //     if (isError) {
    //       window.location.href = '/';
    //     }
    //     if (adminNameData) {
    //       navigate('/admin/overview', { replace: true });
    //     }
    //   }, [isError, adminNameData]);

    //   if (!token) {
    //     return <NotFound />;
    //   }

    //   if (isLoading || isError) {
    //     return <NotFound />;
    //   }

    const getPageTitle = () => {
        const currentPath = location.pathname;
        const matchingNavItem = navItems.find((item) => item.path === currentPath);
        return matchingNavItem ? matchingNavItem.name : 'Admin Dashboard';
    };

    const navLinkClass = ({ isActive }) =>
        `flex items-center py-2.5 rounded-lg hover:bg-gray-700 transition-all duration-200 ${isActive ? 'bg-[#343A40] text-white font-semibold' : 'text-gray-400'
        } ${collapsed ? 'px-2.5' : 'px-4'}`;

    return (
        <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
            <aside
                className={`bg-[#212529] text-white flex flex-col transition-all duration-1000 ${collapsed ? 'w-[60px]' : 'w-64'}`}
            >
                <div
                    className={`flex items-center border-b border-gray-700 h-16 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}
                >
                    <div
                        className={`overflow-hidden transition-all duration-300 ${collapsed ? 'w-0' : 'w-auto'}`}
                    >
                        <img src={BNCC} alt="BNCC" className="h-5" />
                    </div>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded-lg hover:bg-gray-700 cursor-pointer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 transition-transform duration-300"
                            style={{
                                transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                            }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                            />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 px-2 py-6 space-y-2">
                    {navItems.map((item) => (
                        <NavLink key={item.name} to={item.path} className={navLinkClass}>
                            <img
                                src={item.icon || '/placeholder.svg'}
                                alt=""
                                className="w-6 h-6 flex-shrink-0"
                            />
                            <span
                                className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${collapsed ? 'w-0 ml-0 text-transparent' : 'w-full ml-4'
                                    }`}
                            >
                                {item.name}
                            </span>
                        </NavLink>
                    ))}
                </nav>

                <button
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = '/';
                    }}
                    className="mt-auto flex items-center px-[18px] py-3 text-red-400 hover:text-white hover:bg-red-600 transition-all duration-200 cursor-pointer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                        />
                    </svg>
                    <span
                        className={`overflow-hidden whitespace-nowrap transition-all duration-200 text-left ${collapsed ? 'w-0 ml-0 text-transparent' : 'w-full ml-4'
                            }`}
                    >
                        Logout
                    </span>
                </button>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white shadow flex items-center justify-between px-6 flex-shrink-0">
                    <h1 className="text-xl font-semibold text-gray-800">
                        {getPageTitle()}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <span className="font-medium text-gray-700">
                            {/* {adminNameDict[adminNameData?.name ?? 'Admin'] ?? 'Admin'} */}
                            {adminNameDict['SUPER'] ?? 'Admin'}
                        </span>
                    </div>
                </header>
                <main
                    className="flex-1 overflow-y-auto overflow-x-auto"
                    style={{ scrollBehavior: 'smooth' }}
                    data-lenis-prevent
                >
                    <div className="w-full h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
