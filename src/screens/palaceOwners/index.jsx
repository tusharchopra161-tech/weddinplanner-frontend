import React, { useState, useEffect } from "react";
import { RiBankLine } from "react-icons/ri";
import { MdOutlineDashboard, MdOutlinePhotoSizeSelectActual, MdOutlinePayment } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { IoSettingsOutline } from "react-icons/io5";
import { LuCalendarCheck } from "react-icons/lu";
import {
  FiBell,
  FiSearch,
  FiMenu,
  FiPlus,
  FiMapPin,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
  FiMoreHorizontal,
  FiArrowUpRight,
  FiCalendar,
  FiEdit2,
} from "react-icons/fi";
import './palaceOwner.css'
import { VenueCreation } from "../../components/VenueCreation";

const menuItems = [
  { name: "Overview", icon: MdOutlineDashboard },
  { name: "Palace Details", icon: RiBankLine },
  { name: "Photos", icon: MdOutlinePhotoSizeSelectActual },
  { name: "Bookings", icon: SlCalender },
  { name: "Availability", icon: LuCalendarCheck },
  { name: "Payments", icon: MdOutlinePayment },
  { name: "Settings", icon: IoSettingsOutline },
];

const bookingsData = [
  { id: "BK-1024", name: "Aarav Sharma", event: "Wedding Ceremony", date: "18 Oct 2026", guests: 500, amount: 125000, status: "Pending", initials: "AS", color: "bg-amber-100 text-amber-800" },
  { id: "BK-1023", name: "Priya Mehta", event: "Engagement", date: "22 Oct 2026", guests: 250, amount: 75000, status: "Confirmed", initials: "PM", color: "bg-rose-100 text-rose-700" },
  { id: "BK-1022", name: "Rohan Kapoor", event: "Reception", date: "25 Oct 2026", guests: 800, amount: 180000, status: "Pending", initials: "RK", color: "bg-blue-100 text-blue-700" },
  { id: "BK-1021", name: "Ananya Verma", event: "Wedding Ceremony", date: "02 Nov 2026", guests: 400, amount: 110000, status: "Confirmed", initials: "AV", color: "bg-purple-100 text-purple-700" },
];

const stats = [
  { title: "Total Bookings", value: "128", change: "+12.5%", description: "vs. last month", icon: SlCalender, color: "bg-[#F5E6D1] text-[#986A3C]" },
  { title: "Pending Requests", value: "08", change: "Needs action", description: "Awaiting your response", icon: FiClock, color: "bg-[#FCE8D5] text-[#B77935]" },
  { title: "Total Earnings", value: "₹8.45L", change: "+18.2%", description: "vs. last month", icon: FiTrendingUp, color: "bg-[#DCEBDD] text-[#42734B]" },
  { title: "Confirmed Events", value: "24", change: "This month", description: "Scheduled events", icon: FiCheckCircle, color: "bg-[#E5E2F8] text-[#6E60A8]" },
];

const upcomingEvents = [
  { day: "18", month: "OCT", name: "Aarav & Family", type: "Wedding Ceremony", time: "10:00 AM" },
  { day: "22", month: "OCT", name: "Priya Mehta", type: "Engagement", time: "05:00 PM" },
  { day: "25", month: "OCT", name: "Rohan Kapoor", type: "Wedding Reception", time: "07:00 PM" },
];

export const PalaceOwners = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [bookings, setBookings] = useState(bookingsData);
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const emptyPalace = {
    name: "",
    location: "",
    price: "",
    capacity: "",
    description: "",
    Images: "",
    facilities: "",
  };
  const [palaceForm, setPalaceForm] = useState(emptyPalace);
  const [palaceId, setPalaceId] = useState(null);
  const [palaceStatus, setPalaceStatus] = useState("");
  const [loadingPalace, setLoadingPalace] = useState(true);
  const [savingPalace, setSavingPalace] = useState(false);
  const [showCreateWizard, setShowCreateWizard] = useState(false);

  const handleBooking = (id, status) => {
    setBookings((previous) =>
      previous.map((booking) =>
        booking.id === id ? { ...booking, status } : booking
      )
    );

    setNotice(
      status === "Confirmed"
        ? "Booking accepted successfully."
        : "Booking rejected successfully."
    );

    setTimeout(() => setNotice(""), 2500);
  };

  const filteredBookings = bookings.filter((booking) =>
    `${booking.name} ${booking.event} ${booking.id}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const money = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  useEffect(() => {
    const checkMyPalace = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setNotice("Please log in again to continue.");
          return;
        }

        const response = await fetch(
          "https://weddingplanner-backend.onrender.com/palace/my",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to check your venue.");
        }

        const myPalaces = Array.isArray(data.palace)
          ? data.palace
          : [];

        if (myPalaces.length === 0) {
          setShowCreateWizard(true);
        } else {
          setShowCreateWizard(false);

          const palace = myPalaces[0];

          setPalaceId(palace._id);
          setPalaceStatus(palace.status || "");
          setPalaceForm({
            name: palace.name || "",
            location: palace.location || "",
            price: palace.price ?? "",
            capacity: palace.capacity ?? "",
            description: palace.description || "",
            Images: Array.isArray(palace.Images)
              ? palace.Images
              : [],
            facilities: Array.isArray(palace.facilities)
              ? palace.facilities
              : [],
          });
        }
      } catch (error) {
        console.error("Check my palace error:", error);
        setNotice(error.message || "Unable to load your venue.");
      } finally {
        setLoadingPalace(false);
      }
    };
    checkMyPalace();
  }, []);

  if (loadingPalace) {
    return (
      <div className="po-main min-h-screen flex items-center justify-center bg-[#FCF6E9] text-[#382D25]">
        <p>Checking your venue...</p>
      </div>
    );
  }

  if (showCreateWizard) {
    return <VenueCreation/>;
  }
  
  return (
    <div className="po-main min-h-screen w-full overflow-x-hidden bg-[#FCF6E9] text-[#382D25]">
      {/* Mobile overlay */}
      {mobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside
        className={`po-aside h-screen fixed inset-y-0 left-0 z-50 flex w-[260px] max-w-[85vw] flex-col overflow-y-auto border-r border-[#E9D8C0] bg-[#F7EFE2] p-5 transition-transform duration-300 gap-2 lg:translate-x-0 ${mobileMenu ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="mb-8 flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#6E4931] text-2xl text-white">
            <RiBankLine />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight">Wedora</h1>
            <p className="text-xs tracking-widest text-[#967C66]">
              PALACE PARTNER
            </p>
          </div>
        </div>

        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[2px] text-[#A18C77]">
          Workspace
        </p>

        <nav className="space-y-1 flex flex-col gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.name;

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setMobileMenu(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${active
                  ? "bg-[#6E4931] text-white shadow-md shadow-[#6E4931]/15"
                  : "text-[#786555] hover:bg-[#EEE1CF] hover:text-[#493526]"
                  }`}
              >
                <Icon className="shrink-0 text-xl" />
                <span>{item.name}</span>
                {item.name === "Bookings" && (
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-xs ${active
                      ? "bg-white/20 text-white"
                      : "bg-[#EAD5B8] text-[#785330]"
                      }`}
                  >
                    {bookings.filter((b) => b.status === "Pending").length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="poasidebottom flex flex-col justify-between h-[18rem]">
          <div className="poasidebottomb  rounded-2xl border border-[#E9D8C0] bg-[#FDF8EF] p-4">
            <div className="mb-2 flex items-center gap-2 text-[#795638]">
              <FiCalendar />
              <span className="text-sm font-semibold">Upcoming event</span>
            </div>
            <p className="text-lg font-bold">18 October</p>
            <p className="mt-1 text-xs text-[#96816C]">
              Wedding ceremony · 500 guests
            </p>
            <button
              onClick={() => {
                setActiveTab("Bookings");
                setMobileMenu(false);
              }}
              className="mt-3 text-sm font-semibold text-[#805638] hover:underline"
            >
              View booking →
            </button>
          </div>

          <div className="flex  items-center gap-3 border-t border-[#E4D6C4] pt-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E7D1B5] font-bold text-[#714C30]">
              RP
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">Royal Palace</p>
              <p className="text-xs text-[#9A826B]">Palace Owner</p>
            </div>
            <button
              title="Settings"
              onClick={() => {
                setActiveTab("Settings");
                setMobileMenu(false);
              }}
              className="shrink-0 text-lg text-[#806D5A]"
            >
              <IoSettingsOutline />
            </button>
          </div>
        </div>
      </aside>


      <main className="min-w-0 w-full lg:ml-[260px]">

        <header className="fixed top-0 z-30 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#EDE2D1] bg-[#FCF6E9]/95 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMobileMenu(true)}
              className="rounded-lg p-2 hover:bg-[#F0E4D2] lg:hidden"
            >
              <FiMenu className="text-xl" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-xs text-[#9A826B]">
                Workspace / {activeTab}
              </p>
              <h2 className="truncate text-lg font-bold sm:text-xl">
                {activeTab}
              </h2>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3 sm:gap-5">
            <div className="hidden items-center gap-2 rounded-xl border border-[#E8DDCC] bg-white/70 px-3 py-2 md:flex">
              <FiSearch className="shrink-0 text-[#9A826B]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bookings..."
                className="w-36 bg-transparent text-sm outline-none placeholder:text-[#B2A18D] lg:w-48"
              />
            </div>

            <button className="relative shrink-0 rounded-xl border border-[#E8DDCC] bg-white/70 p-2.5">
              <FiBell className="text-lg" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#B86B43]" />
            </button>

            <div className="hidden h-9 w-px bg-[#E5D8C7] sm:block" />

            <div className="flex items-center gap-2">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold">Royal Palace</p>
                <p className="text-xs text-[#99836D]">Verified Partner</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6E4931] font-bold text-white">
                RP
              </div>
            </div>
          </div>
        </header>

        <div className="hmain mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {notice && (
            <div className="mb-5 rounded-xl border border-[#D8C7AC] bg-[#F4E8D5] px-4 py-3 text-sm font-medium text-[#63462D]">
              {notice}
            </div>
          )}

          {activeTab === "Overview" && (
            <>

              <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <p className="mb-2 text-sm text-[#A08365]">
                    Friday, October 9, 2026
                  </p>
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Welcome back, Royal Palace
                  </h1>
                  <p className="mt-2 text-sm text-[#947E69]">
                    Here's what's happening with your venue today.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("Palace Details")}
                  className="flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-[#6E4931] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#6E4931]/15 transition hover:bg-[#523622] sm:self-auto"
                >
                  <FiPlus className="text-lg" />
                  Edit Palace Details
                </button>
              </section>

              {/* Statistics */}
              <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.title}
                      className="porm min-w-0 rounded-2xl border border-[#EDE2D1] bg-white/80  transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#74563B]/5"
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${stat.color}`}
                        >
                          <Icon />
                        </div>
                        <FiMoreHorizontal className="text-xl text-[#B5A38E]" />
                      </div>

                      <p className="text-sm text-[#99836D]">{stat.title}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <h3 className="text-2xl font-bold">{stat.value}</h3>
                        <span className="rounded-md bg-[#E7F1E5] px-2 py-1 text-xs font-semibold text-[#4C8051]">
                          {stat.change}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-[#AA9884]">
                        {stat.description}
                      </p>
                    </div>
                  );
                })}
              </section>

              {/* Palace information and upcoming events */}
              <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="min-w-0 overflow-hidden rounded-2xl border border-[#EDE2D1] bg-white/80">
                  <div className="flex items-center justify-between gap-3 px-5 pt-5 sm:px-6">
                    <div className="min-w-0">
                      <h3 className="font-bold">Your Palace</h3>
                      <p className="mt-1 text-xs text-[#A18B75]">
                        Manage your venue profile
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("Palace Details")}
                      className="flex shrink-0 items-center gap-2 rounded-lg border border-[#E8DDCC] px-3 py-2 text-xs font-semibold hover:bg-[#F8F0E5]"
                    >
                      <FiEdit2 />
                      Edit
                    </button>
                  </div>

                  <div className="relative mx-5 mt-5 h-48 overflow-hidden rounded-xl sm:mx-6 sm:h-56">
                    <img
                      src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85"
                      alt="Elegant wedding palace venue"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-md">
                        <FiCheckCircle />
                        Verified venue
                      </span>
                      <h4 className="text-xl font-bold">Royal Palace</h4>
                      <p className="mt-1 flex items-center gap-1 text-sm text-white/85">
                        <FiMapPin className="shrink-0" />
                        Sonipat, Haryana
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 sm:px-6">
                    <div>
                      <p className="text-xs text-[#A18B75]">Starting price</p>
                      <p className="mt-1 font-bold">₹85,000</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#A18B75]">Guest capacity</p>
                      <p className="mt-1 font-bold">2,000 guests</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-xs text-[#A18B75]">Gallery photos</p>
                      <p className="mt-1 font-bold">12 photos</p>
                    </div>
                  </div>
                </div>

                <div className="min-w-0 rounded-2xl border border-[#EDE2D1] bg-white/80 p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold">Upcoming Events</h3>
                      <p className="mt-1 text-xs text-[#A18B75]">
                        Your next scheduled bookings
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("Bookings")}
                      className="shrink-0 text-sm font-semibold text-[#805638] hover:underline"
                    >
                      View all
                    </button>
                  </div>

                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.day}
                        className="flex items-center gap-3 rounded-xl border border-[#F0E6D8] p-3"
                      >
                        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[#F5E9D8] text-[#795638]">
                          <span className="text-xl font-bold leading-none">
                            {event.day}
                          </span>
                          <span className="mt-1 text-[10px] font-bold tracking-wider">
                            {event.month}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold">
                            {event.name}
                          </p>
                          <p className="mt-1 truncate text-xs text-[#9D8771]">
                            {event.type}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-[#9D8771]">
                            <FiClock className="shrink-0" />
                            {event.time}
                          </p>
                        </div>
                        <FiArrowUpRight className="shrink-0 text-lg text-[#9D8771]" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Booking requests */}
              <section className="overflow-hidden rounded-2xl border border-[#EDE2D1] bg-white/80">
                <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6">
                  <div className="min-w-0">
                    <h3 className="font-bold">Recent Booking Requests</h3>
                    <p className="mt-1 text-xs text-[#A18B75]">
                      Review and manage your customer requests
                    </p>
                  </div>

                  <div className="flex min-w-0 gap-2">
                    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#E8DDCC] px-3 py-2 md:hidden">
                      <FiSearch className="shrink-0" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="w-full min-w-0 bg-transparent text-sm outline-none"
                      />
                    </div>
                    <button
                      onClick={() => setActiveTab("Bookings")}
                      className="shrink-0 whitespace-nowrap rounded-lg bg-[#F2E5D2] px-4 py-2 text-sm font-semibold text-[#785536] hover:bg-[#EAD8BE]"
                    >
                      All bookings
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead>
                      <tr className="border-y border-[#F0E6D8] bg-[#FCF8F1] text-xs text-[#A18B75]">
                        <th className="px-6 py-4 font-semibold">CUSTOMER</th>
                        <th className="px-4 py-4 font-semibold">EVENT</th>
                        <th className="px-4 py-4 font-semibold">DATE</th>
                        <th className="px-4 py-4 font-semibold">AMOUNT</th>
                        <th className="px-4 py-4 font-semibold">STATUS</th>
                        <th className="px-6 py-4 text-right font-semibold">
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="border-b border-[#F3EBDD] last:border-0 hover:bg-[#FFFCF7]"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${booking.color}`}
                              >
                                {booking.initials}
                              </div>
                              <div>
                                <p className="whitespace-nowrap text-sm font-semibold">
                                  {booking.name}
                                </p>
                                <p className="mt-1 text-xs text-[#AA9681]">
                                  {booking.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="whitespace-nowrap text-sm">
                              {booking.event}
                            </p>
                            <p className="mt-1 flex items-center gap-1 whitespace-nowrap text-xs text-[#A18B75]">
                              <FiUsers />
                              {booking.guests} guests
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-[#786555]">
                            {booking.date}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm font-bold">
                            {money(booking.amount)}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${booking.status === "Confirmed"
                                ? "bg-[#E4F1E2] text-[#48784B]"
                                : booking.status === "Rejected"
                                  ? "bg-[#FBE5E0] text-[#A94D3B]"
                                  : "bg-[#FFF0D6] text-[#A36D25]"
                                }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {booking.status === "Pending" ? (
                                <>
                                  <button
                                    title="Accept booking"
                                    onClick={() =>
                                      handleBooking(booking.id, "Confirmed")
                                    }
                                    className="flex items-center gap-1 rounded-lg bg-[#E4F1E2] px-3 py-2 text-xs font-semibold text-[#48784B] transition hover:bg-[#CFE7CC]"
                                  >
                                    <FiCheckCircle />
                                    Accept
                                  </button>
                                  <button
                                    title="Reject booking"
                                    onClick={() =>
                                      handleBooking(booking.id, "Rejected")
                                    }
                                    className="flex items-center gap-1 rounded-lg bg-[#FBE5E0] px-3 py-2 text-xs font-semibold text-[#A94D3B] transition hover:bg-[#F4D0C8]"
                                  >
                                    <FiXCircle />
                                    Reject
                                  </button>
                                </>
                              ) : (
                                <span className="text-xs text-[#A18B75]">
                                  {booking.status === "Confirmed"
                                    ? "Accepted"
                                    : "Rejected"}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredBookings.length === 0 && (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-12 text-center text-sm text-[#A18B75]"
                          >
                            No bookings found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col justify-between gap-2 border-t border-[#F0E6D8] px-6 py-4 text-xs text-[#A18B75] sm:flex-row">
                  <p>Showing {filteredBookings.length} booking requests</p>
                  <p>Booking decisions update this dashboard locally.</p>
                </div>
              </section>
            </>
          )}

          {/* Palace details */}
          {activeTab === "Palace Details" && (
            <section className="mx-auto max-w-3xl rounded-2xl border border-[#EDE2D1] bg-white/80 p-5 sm:p-8">
              <h3 className="text-xl font-bold">Palace Details</h3>
              <p className="mb-6 mt-2 text-sm text-[#99836D]">
                Add or update your venue information.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setNotice("Palace details form submitted.");
                  setTimeout(() => setNotice(""), 2500);
                }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2"
              >
                {[
                  ["Palace Name", "Royal Palace"],
                  ["Location", "Sonipat, Haryana"],
                  ["Starting Price (₹)", "85000"],
                  ["Guest Capacity", "2000"],
                ].map(([label, value]) => (
                  <label key={label} className="block text-sm font-semibold">
                    {label}
                    <input
                      defaultValue={value}
                      required
                      className="mt-2 w-full rounded-xl border border-[#E8DDCC] bg-[#FFFCF7] px-4 py-3 font-normal outline-none focus:border-[#98714D]"
                    />
                  </label>
                ))}
                <label className="block text-sm font-semibold sm:col-span-2">
                  Palace Description
                  <textarea
                    rows="4"
                    placeholder="Describe your palace, facilities and amenities..."
                    className="mt-2 w-full rounded-xl border border-[#E8DDCC] bg-[#FFFCF7] px-4 py-3 font-normal outline-none focus:border-[#98714D]"
                  />
                </label>
                <button className="rounded-xl bg-[#6E4931] px-5 py-3 text-sm font-semibold text-white hover:bg-[#523622] sm:col-span-2">
                  Save Palace Details
                </button>
              </form>
            </section>
          )}

          {/* Photos */}
          {activeTab === "Photos" && (
            <section className="rounded-2xl border border-[#EDE2D1] bg-white/80 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-xl font-bold">Palace Gallery</h3>
                  <p className="mt-2 text-sm text-[#99836D]">
                    Select images to preview your gallery.
                  </p>
                </div>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#6E4931] px-4 py-3 text-sm font-semibold text-white">
                  <FiPlus />
                  Choose Photos
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setNotice(
                        `${files.length} photo(s) selected. Connect your image upload API to save them.`
                      );
                      setTimeout(() => setNotice(""), 3000);
                    }}
                  />
                </label>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  "photo-1519167758481-83f550bb49b3",
                  "photo-1519741497674-611481863552",
                  "photo-1464366400600-7168b8af9bc3",
                ].map((photo) => (
                  <img
                    key={photo}
                    src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=700&q=80`}
                    alt="Palace gallery"
                    className="h-52 w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Bookings */}
          {activeTab === "Bookings" && (
            <section className="rounded-2xl border border-[#EDE2D1] bg-white/80 p-5 sm:p-7">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <h3 className="text-xl font-bold">Manage Bookings</h3>
                  <p className="mt-2 text-sm text-[#99836D]">
                    Accept or reject incoming venue booking requests.
                  </p>
                </div>
                <div className="flex min-w-0 items-center gap-2 rounded-xl border border-[#E8DDCC] px-3 py-2">
                  <FiSearch className="shrink-0" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search bookings..."
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
              <div className="space-y-3">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-[#F0E6D8] p-4 md:flex-row md:items-center"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-bold ${booking.color}`}
                      >
                        {booking.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold">{booking.name}</p>
                        <p className="mt-1 text-sm text-[#99836D]">
                          {booking.event} · {booking.guests} guests
                        </p>
                        <p className="mt-1 text-xs text-[#99836D]">
                          {booking.id} · {booking.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-bold">{money(booking.amount)}</p>
                      {booking.status === "Pending" ? (
                        <>
                          <button
                            onClick={() =>
                              handleBooking(booking.id, "Confirmed")
                            }
                            className="rounded-lg bg-[#E4F1E2] px-4 py-2 text-sm font-semibold text-[#48784B]"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleBooking(booking.id, "Rejected")
                            }
                            className="rounded-lg bg-[#FBE5E0] px-4 py-2 text-sm font-semibold text-[#A94D3B]"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="rounded-full bg-[#F2E8D8] px-3 py-2 text-xs font-semibold">
                          {booking.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {filteredBookings.length === 0 && (
                  <p className="py-10 text-center text-sm text-[#A18B75]">
                    No bookings found.
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Availability */}
          {activeTab === "Availability" && (
            <section className="rounded-2xl border border-[#EDE2D1] bg-white/80 p-5 sm:p-8">
              <h3 className="text-xl font-bold">Venue Availability</h3>
              <p className="mb-6 mt-2 text-sm text-[#99836D]">
                Select a date and manage whether your palace is available.
              </p>
              <div className="w-full max-w-lg rounded-xl border border-[#E8DDCC] bg-[#FFFCF7] p-5">
                <label className="block text-sm font-semibold">
                  Select date
                  <input
                    type="date"
                    className="mt-2 w-full rounded-lg border border-[#E8DDCC] bg-white p-3 font-normal"
                    onChange={(e) => {
                      if (e.target.value) {
                        setNotice(`Selected availability date: ${e.target.value}`);
                        setTimeout(() => setNotice(""), 2500);
                      }
                    }}
                  />
                </label>
                <p className="mb-4 mt-5 text-sm text-[#99836D]">
                  Availability changes need to be saved to your backend to
                  affect customer bookings.
                </p>
                <button
                  onClick={() => {
                    setNotice("Connect the availability API to save this setting.");
                    setTimeout(() => setNotice(""), 3000);
                  }}
                  className="rounded-xl bg-[#6E4931] px-5 py-3 text-sm font-semibold text-white"
                >
                  Save Availability
                </button>
              </div>
            </section>
          )}

          {/* Payments */}
          {activeTab === "Payments" && (
            <section className="rounded-2xl border border-[#EDE2D1] bg-white/80 p-5 sm:p-8">
              <h3 className="text-xl font-bold">Payments & Earnings</h3>
              <p className="mt-2 text-sm text-[#99836D]">
                Overview of booking amounts and payment statuses.
              </p>
              <div className="my-6 rounded-2xl bg-[#F4E7D4] p-6">
                <p className="text-sm text-[#8B6B4A]">Total listed booking value</p>
                <h4 className="mt-2 text-2xl font-bold sm:text-3xl">
                  {money(
                    bookings
                      .filter((b) => b.status === "Confirmed")
                      .reduce((sum, b) => sum + b.amount, 0)
                  )}
                </h4>
              </div>
              <div className="space-y-3">
                {bookings
                  .filter((b) => b.status === "Confirmed")
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#F0E6D8] p-4"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold">{booking.name}</p>
                        <p className="mt-1 text-xs text-[#99836D]">
                          {booking.id} · {booking.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{money(booking.amount)}</p>
                        <p className="mt-1 text-xs text-[#48784B]">
                          Booking confirmed
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Settings */}
          {activeTab === "Settings" && (
            <section className="mx-auto max-w-2xl rounded-2xl border border-[#EDE2D1] bg-white/80 p-5 sm:p-8">
              <h3 className="text-xl font-bold">Account Settings</h3>
              <p className="mb-6 mt-2 text-sm text-[#99836D]">
                Manage your palace owner account information.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setNotice("Settings submitted successfully.");
                  setTimeout(() => setNotice(""), 2500);
                }}
                className="space-y-5"
              >
                <label className="block text-sm font-semibold">
                  Owner / Business Name
                  <input
                    defaultValue="Royal Palace"
                    className="mt-2 w-full rounded-xl border border-[#E8DDCC] bg-[#FFFCF7] px-4 py-3 font-normal outline-none focus:border-[#98714D]"
                  />
                </label>
                <label className="block text-sm font-semibold">
                  Contact Email
                  <input
                    type="email"
                    placeholder="owner@example.com"
                    className="mt-2 w-full rounded-xl border border-[#E8DDCC] bg-[#FFFCF7] px-4 py-3 font-normal outline-none focus:border-[#98714D]"
                  />
                </label>
                <label className="block text-sm font-semibold">
                  Contact Number
                  <input
                    type="tel"
                    placeholder="Enter contact number"
                    className="mt-2 w-full rounded-xl border border-[#E8DDCC] bg-[#FFFCF7] px-4 py-3 font-normal outline-none focus:border-[#98714D]"
                  />
                </label>
                <button className="rounded-xl bg-[#6E4931] px-5 py-3 text-sm font-semibold text-white hover:bg-[#523622]">
                  Save Settings
                </button>
              </form>
            </section>
          )}

          <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-[#E9DECD] pt-5 text-xs text-[#A18B75] sm:flex-row">
            <p>© 2026 Wedora · Palace Partner Dashboard</p>
            <p>Making every celebration memorable.</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default PalaceOwners;
