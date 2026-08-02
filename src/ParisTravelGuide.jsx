import React, { useState, useEffect, useMemo } from "react";
import { MapPin, Plane, Home, Key, Train, ExternalLink, Clock, Sun, Sunset, StickyNote, ChevronRight } from "lucide-react";
// Imported so Vite fingerprints it and prefixes the site's base path — a bare
// "/assets/..." string would 404, since the site is served from /Paris-trip/.
import sacreCoeurTrain from "./assets/sacre-coeur-train.jpg";
import disneylandCastle from "./assets/disneyland-paris-castle.jpg";

/* ============================================================
   DATA LAYER — edit these objects to update the whole site
   ============================================================ */

const TRIP = {
  title: "Paris",
  year: "2026",
  dates: "October 6–12, 2026",
  departureISO: "2026-10-06T09:00:00",
};

const FLIGHTS = {
  outbound: {
    label: "Outbound",
    route: "ORD → CDG",
    date: "Monday, Oct 5, 2026",
    flightNumber: "UA 987",
    depart: "6:10 PM",
    arrive: "9:20 AM +1",
    confirmation: "",
  },
  return: {
    label: "Return",
    route: "CDG → ORD",
    date: "Monday, Oct 12, 2026",
    flightNumber: "AA 151",
    depart: "2:50 PM (Paris time)",
    arrive: "4:50 PM (Chicago time)",
    confirmation: "",
  },
};

const AIRBNB = {
  address: "1 Square de la Tour-Maubourg, Paris, Île-de-France 75007, France",
  lat: 48.8595,
  lng: 2.3078,
  checkIn: "Please reach out to host for check-in instructions.",
  checkOut: "TBD — confirm with host.",
  metro: "École Militaire (Line 8) — nearby",
};

const RESTAURANTS = [
  { name: "La Parisienne", rating: "4.3", note: "Bakery — right around the corner, award-winning baguettes.", address: "85 Rue Saint-Dominique" },
  { name: "Le Moulin de la Vierge", rating: "4.2", note: "Bakery — classic old-Paris bakery, great croissants.", address: "64 Rue Saint-Dominique" },
  { name: "Boulangerie Liberté", rating: "4.2", note: "Bakery — excellent pastries, has seating.", address: "58 Rue Saint-Dominique" },
  { name: "La Charrette à Crêpes", rating: "5.0", note: "Casual crêperie right on the corner.", address: "86 Rue Saint-Dominique" },
  { name: "Vendémiaire", rating: "4.8", note: "Elegant French brasserie, ~5 min walk.", address: "54 Bd de la Tour-Maubourg" },
  { name: "Kozy École Militaire", rating: "4.9", note: "All-day brunch & coffee.", address: "55 Rue Cler" },
  { name: "Gusto Italia Amélie", rating: "4.7", note: "Cozy Italian, great pasta.", address: "11 Rue Amélie" },
  { name: "Milagro", rating: "4.8", note: "~10 min walk, but worth it — repeatedly called the best meal in Paris.", address: "85 Av. Bosquet" },
];

const QUICK_LINKS = [
  { label: "Airbnb Listing", url: "https://airbnb.com" },
  { label: "Directions to Airbnb", url: "https://maps.google.com" },
  { label: "Paris Metro Map", url: "https://www.ratp.fr" },
];

const ITINERARY = [
  {
    day: "Tuesday",
    date: "Oct 6",
    morning: "Land 9:20 AM — head to Airbnb",
    afternoon: "Explore the neighborhood",
    notes: "Arrival day — keep it easy.",
    image: null,
  },
  {
    day: "Wednesday",
    date: "Oct 7",
    morning: "Eiffel Tower & Champ de Mars",
    afternoon: "Catacombs",
    notes: "Eiffel Tower & Catacombs tickets booked in advance.",
    image: "https://images.unsplash.com/photo-1616769689599-5b281aa03daf?q=80&w=1200&auto=format&fit=crop",
  },
  {
    day: "Thursday",
    date: "Oct 8",
    morning: "Luxembourg Gardens",
    afternoon: "Musée de l'Orangerie + Tuileries Garden",
    notes: "Museum tickets booked in advance. Taking the Red Hop On Bus to get around. Other spots to see: Sainte-Chapelle, Shakespeare & Co, Angelina.",
    image: "https://images.unsplash.com/photo-1756239502220-4679325de757?q=80&w=1200&auto=format&fit=crop",
  },
  {
    day: "Friday",
    date: "Oct 9",
    morning: "Disney",
    afternoon: "Disney",
    notes: "",
    image: disneylandCastle,
  },
  {
    day: "Saturday",
    date: "Oct 10",
    morning: "Explore Flea Markets",
    afternoon: "6pm Seine River Cruise",
    notes: "Top 2 to try: Marché aux Puces de Saint-Ouen (the largest & most famous) and Marché aux Puces de Vanves (smaller, more affordable, great for browsing).",
    image: "https://images.unsplash.com/photo-1567187155374-cd9135b1f247?q=80&w=1200&auto=format&fit=crop",
  },
  {
    day: "Sunday",
    date: "Oct 11",
    morning: "Sacré-Cœur & the little train of Montmartre",
    afternoon: "Open",
    notes: "Pack up — we leave Monday morning.",
    image: sacreCoeurTrain,
  },
  {
    day: "Monday",
    date: "Oct 12",
    morning: "Pack up, depart for CDG",
    afternoon: "Flight home",
    notes: "Leave Airbnb by 11:30 AM for airport.",
    image: null,
  },
];

const RECOMMENDATIONS = [
  { id: 1, name: "Sainte-Chapelle", category: "Attraction", desc: "Soaring stained-glass chapel on Île de la Cité.", time: "45 min", address: "8 Bd du Palais, 75001", lat: 48.8554, lng: 2.3450 },
  { id: 2, name: "La Galerie Dior", category: "Shopping", desc: "Immersive fashion museum on Avenue Montaigne.", time: "1.5 hr", address: "11 Rue François 1er, 75008", lat: 48.8666, lng: 2.3033 },
  { id: 3, name: "Shakespeare & Company", category: "Shopping", desc: "Iconic English-language bookshop by Notre-Dame.", time: "30 min", address: "37 Rue de la Bûcherie, 75005", lat: 48.8524, lng: 2.3470 },
  { id: 4, name: "Angelina", category: "Food", desc: "Legendary hot chocolate and pastries near the Louvre.", time: "45 min", address: "226 Rue de Rivoli, 75001", lat: 48.8651, lng: 2.3285 },
  { id: 5, name: "Galeries Lafayette Rooftop", category: "Attraction", desc: "Free panoramic view over the Paris rooftops.", time: "20 min", address: "40 Bd Haussmann, 75009", lat: 48.8735, lng: 2.3319 },
  { id: 6, name: "Luxembourg Gardens", category: "Park", desc: "Elegant gardens with a pond, ponies, and a playground.", time: "1–2 hr", address: "75006 Paris", lat: 48.8462, lng: 2.3372 },
  { id: 7, name: "Parc Monceau", category: "Park", desc: "Romantic, quiet park with follies and shaded paths.", time: "1 hr", address: "35 Bd de Courcelles, 75008", lat: 48.8797, lng: 2.3086 },
  { id: 8, name: "Champ de Mars Playground", category: "Kids", desc: "Playground with a direct view of the Eiffel Tower.", time: "45 min", address: "2 Allée Adrienne Lecouvreur, 75007", lat: 48.8556, lng: 2.2986 },
  { id: 9, name: "Tuileries Playground", category: "Kids", desc: "Carousel and play area inside the Tuileries Garden.", time: "45 min", address: "Jardin des Tuileries, 75001", lat: 48.8635, lng: 2.3255 },
];

const CATEGORY_COLORS = {
  Food: "#B08968",
  Shopping: "#9C8AA5",
  Attraction: "#C9A227",
  Park: "#6E8B6E",
  Kids: "#C97B63",
  "Rainy Day": "#7C93A8",
};

/* ============================================================
   SHARED UI PRIMITIVES
   ============================================================ */

const PAGES = ["Home", "Travel Details", "Trip Itinerary", "Other Ideas"];

function useCountdown(targetISO) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const target = new Date(targetISO).getTime();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

function NavBar({ page, setPage }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 40 }}>
      <div
        style={{
          background: "rgba(250,247,240,0.88)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #E7E0D2",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
          }}
        >
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 20,
              letterSpacing: "0.02em",
              color: "#3A342C",
            }}
          >
            Bobulski Family
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {PAGES.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  background: page === p ? "#3A342C" : "transparent",
                  color: page === p ? "#FAF7F0" : "#6B6255",
                  border: "none",
                  borderRadius: 999,
                  padding: "8px 16px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 20,
        padding: "28px 30px",
        boxShadow: "0 2px 20px rgba(58,52,44,0.06)",
        border: "1px solid #F0EAE0",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "#B4925A",
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 32,
        fontWeight: 500,
        color: "#3A342C",
        margin: "0 0 28px 0",
        letterSpacing: "0.01em",
      }}
    >
      {children}
    </h2>
  );
}

/* ============================================================
   HOME PAGE
   ============================================================ */

function HomePage({ setPage }) {
  const { days, hours, minutes, seconds } = useCountdown(TRIP.departureISO);

  return (
    <div>
      <div
        style={{
          position: "relative",
          height: "78vh",
          minHeight: 520,
          borderRadius: "0 0 32px 32px",
          overflow: "hidden",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1551519642-3a26558be311?q=80&w=1600&auto=format&fit=crop"
          alt="Paris in autumn, Eiffel Tower"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.82)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(30,26,20,0.38) 0%, rgba(30,26,20,0.28) 40%, rgba(20,17,13,0.62) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#EFE6D2",
              marginBottom: 18,
            }}
          >
            The Bobulski Family
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(48px, 9vw, 92px)",
              color: "#FFFDF8",
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: "0.01em",
            }}
          >
            {TRIP.title}, {TRIP.year}
          </h1>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 17,
              color: "#EFE6D2",
              marginTop: 18,
              letterSpacing: "0.02em",
            }}
          >
            {TRIP.dates}
          </div>

          <div
            style={{
              display: "flex",
              gap: "clamp(14px, 4vw, 36px)",
              marginTop: 46,
            }}
          >
            {[
              { label: "Days", value: days },
              { label: "Hours", value: hours },
              { label: "Min", value: minutes },
              { label: "Sec", value: seconds },
            ].map((u) => (
              <div key={u.label} style={{ textAlign: "center", minWidth: 56 }}>
                <div
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(30px, 6vw, 44px)",
                    color: "#FFFDF8",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {String(u.value).padStart(2, "0")}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#D9CDB0",
                    marginTop: 4,
                  }}
                >
                  {u.label}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#D9CDB0",
              marginTop: 14,
            }}
          >
            Until we land in Paris
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 24px 0" }}>
        <div
          style={{
            borderRadius: 24,
            overflow: "hidden",
            height: 340,
            boxShadow: "0 4px 24px rgba(58,52,44,0.08)",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1602833334025-5019f046b8f7?q=80&w=1400&auto=format&fit=crop"
            alt="A café terrace in Paris"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>

      <div
        style={{
          maxWidth: 780,
          margin: "0 auto",
          padding: "40px 24px 90px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 18,
        }}
      >
        {[
          { page: "Travel Details", desc: "Flights, Airbnb & essentials", icon: Plane },
          { page: "Trip Itinerary", desc: "Our day-by-day plan", icon: Clock },
          { page: "Other Ideas", desc: "If we have time", icon: MapPin },
        ].map((item) => (
          <button
            key={item.page}
            onClick={() => setPage(item.page)}
            style={{
              background: "#FFFFFF",
              border: "1px solid #F0EAE0",
              borderRadius: 18,
              padding: "26px 22px",
              textAlign: "left",
              cursor: "pointer",
              boxShadow: "0 2px 16px rgba(58,52,44,0.05)",
              transition: "transform 0.15s ease",
            }}
          >
            <item.icon size={20} color="#B4925A" strokeWidth={1.6} />
            <div
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 19,
                color: "#3A342C",
                marginTop: 14,
              }}
            >
              {item.page}
            </div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: "#8A8070",
                marginTop: 4,
              }}
            >
              {item.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   TRAVEL DETAILS PAGE
   ============================================================ */

function FlightRow({ flight }) {
  return (
    <div style={{ padding: "18px 0", borderBottom: "1px solid #F0EAE0" }}>
      <Eyebrow>{flight.label}</Eyebrow>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: "#3A342C" }}>
          {flight.route}
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8A8070" }}>{flight.date}</div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 24,
          marginTop: 10,
          flexWrap: "wrap",
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          color: "#6B6255",
        }}
      >
        <span>Flight {flight.flightNumber}</span>
        <span>Depart {flight.depart}</span>
        <span>Arrive {flight.arrive}</span>
        {flight.confirmation && <span>Conf. #{flight.confirmation}</span>}
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "12px 0" }}>
      <Icon size={16} color="#B4925A" strokeWidth={1.6} style={{ marginTop: 3, flexShrink: 0 }} />
      <div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#B0A891" }}>
          {label}
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#3A342C", marginTop: 3, lineHeight: 1.5 }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function TravelDetailsPage() {
  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "56px 24px 90px" }}>
      <Eyebrow>Practical Information</Eyebrow>
      <SectionTitle>Travel Details</SectionTitle>

      <Card style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Plane size={18} color="#3A342C" strokeWidth={1.6} />
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: "#3A342C", margin: 0 }}>
            Flights
          </h3>
        </div>
        <FlightRow flight={FLIGHTS.outbound} />
        <div style={{ paddingBottom: 0 }}>
          <FlightRow flight={FLIGHTS.return} />
        </div>
      </Card>

      <Card style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Home size={18} color="#3A342C" strokeWidth={1.6} />
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: "#3A342C", margin: 0 }}>
            Airbnb
          </h3>
        </div>
        <DetailRow icon={MapPin} label="Address" value={AIRBNB.address} />

        <div
          style={{
            marginTop: 10,
            marginBottom: 6,
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid #F0EAE0",
            height: 200,
          }}
        >
          <iframe
            title="Airbnb location"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${AIRBNB.lng - 0.01}%2C${AIRBNB.lat - 0.008}%2C${AIRBNB.lng + 0.01}%2C${AIRBNB.lat + 0.008}&layer=mapnik&marker=${AIRBNB.lat}%2C${AIRBNB.lng}`}
            style={{ width: "100%", height: "100%", border: 0 }}
          />
        </div>

        <DetailRow icon={Key} label="Check-in" value={AIRBNB.checkIn} />
        <DetailRow icon={Key} label="Check-out" value={AIRBNB.checkOut} />
        <DetailRow icon={Train} label="Nearest Metro" value={AIRBNB.metro} />
      </Card>

      <Card style={{ marginBottom: 22 }}>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: "#3A342C", margin: "0 0 4px 0" }}>
          Restaurants
        </h3>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#B0A891", marginBottom: 14 }}>
          Highly-rated spots within walking distance
        </div>
        {RESTAURANTS.map((r) => (
          <div key={r.name} style={{ padding: "10px 0", borderBottom: "1px solid #F0EAE0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#3A342C", fontWeight: 500 }}>
                {r.name}
              </span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#B4925A", fontWeight: 600 }}>
                {r.rating}★
              </span>
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#8A8070", marginTop: 2 }}>
              {r.note}
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#B0A891", marginTop: 2 }}>
              {r.address}
            </div>
          </div>
        ))}
      </Card>

      <Card>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: "#3A342C", margin: "0 0 12px 0" }}>
          Quick Links
        </h3>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {QUICK_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "13px 0",
                borderBottom: "1px solid #F0EAE0",
                textDecoration: "none",
                color: "#3A342C",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
              }}
            >
              {l.label}
              <ExternalLink size={14} color="#B4925A" />
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   ITINERARY PAGE
   ============================================================ */

function DayCard({ day }) {
  const rows = [
    { icon: Sun, label: "Morning", value: day.morning },
    { icon: Sunset, label: "Afternoon", value: day.afternoon },
    { icon: StickyNote, label: "Notes", value: day.notes },
  ].filter((r) => r.value && r.value.trim() !== "");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: day.image ? "180px 1fr" : "1fr",
        gap: 0,
        marginBottom: 18,
        background: "#FFFFFF",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 2px 20px rgba(58,52,44,0.06)",
        border: "1px solid #F0EAE0",
      }}
    >
      {day.image && (
        <div style={{ minHeight: "100%" }}>
          <img
            src={day.image}
            alt={day.day}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      )}
      <div style={{ padding: "24px 28px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
          <h3
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 24,
              fontStyle: "italic",
              color: "#3A342C",
              margin: 0,
            }}
          >
            {day.day}
          </h3>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#B0A891", letterSpacing: "0.05em" }}>
            {day.date}
          </span>
        </div>
        <div style={{ width: 28, height: 1.5, background: "#D9C9A0", marginBottom: 14 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", columnGap: 20 }}>
          {rows.map((r) => (
            <div key={r.label} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "9px 0" }}>
              <r.icon size={15} color="#B4925A" strokeWidth={1.6} style={{ marginTop: 3, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "#B0A891" }}>
                  {r.label}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#3A342C", marginTop: 2, lineHeight: 1.5 }}>
                  {r.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ItineraryPage() {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "56px 24px 90px" }}>
      <Eyebrow>Day by Day</Eyebrow>
      <SectionTitle>Trip Itinerary</SectionTitle>
      {ITINERARY.map((d) => (
        <DayCard key={d.day} day={d} />
      ))}
    </div>
  );
}

/* ============================================================
   OTHER IDEAS PAGE (interactive map + list)
   ============================================================ */

function OtherIdeasPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const categories = ["All", ...Object.keys(CATEGORY_COLORS)];

  const filtered = useMemo(
    () => RECOMMENDATIONS.filter((r) => activeCategory === "All" || r.category === activeCategory),
    [activeCategory]
  );

  // Compute simple lat/lng bounding box to place pins on a static-style map div
  const lats = RECOMMENDATIONS.map((r) => r.lat).concat(AIRBNB.lat);
  const lngs = RECOMMENDATIONS.map((r) => r.lng).concat(AIRBNB.lng);
  const minLat = Math.min(...lats) - 0.006;
  const maxLat = Math.max(...lats) + 0.006;
  const minLng = Math.min(...lngs) - 0.006;
  const maxLng = Math.max(...lngs) + 0.006;

  const project = (lat, lng) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
    return { x, y };
  };

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "56px 24px 90px" }}>
      <Eyebrow>If We Have Time</Eyebrow>
      <SectionTitle>Other Ideas</SectionTitle>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            style={{
              background: activeCategory === c ? "#3A342C" : "#FFFFFF",
              color: activeCategory === c ? "#FAF7F0" : "#6B6255",
              border: "1px solid #F0EAE0",
              borderRadius: 999,
              padding: "7px 16px",
              fontFamily: "'Inter', sans-serif",
              fontSize: 12.5,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 22 }}>
        {/* Map */}
        <div
          style={{
            position: "relative",
            background: "#EFE9DB",
            borderRadius: 20,
            border: "1px solid #F0EAE0",
            minHeight: 460,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
            <img
              src="https://images.unsplash.com/photo-1541636217172-2beb0e6a6947?q=80&w=1200&auto=format&fit=crop"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ position: "absolute", inset: 0, background: "rgba(239,233,219,0.55)" }} />

          {/* Airbnb pin */}
          {(() => {
            const p = project(AIRBNB.lat, AIRBNB.lng);
            return (
              <div
                title="Airbnb"
                style={{
                  position: "absolute",
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: "translate(-50%,-100%)",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50% 50% 50% 0",
                    background: "#3A342C",
                    transform: "rotate(-45deg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
                  }}
                >
                  <Home size={13} color="#FAF7F0" style={{ transform: "rotate(45deg)" }} />
                </div>
              </div>
            );
          })()}

          {filtered.map((r) => {
            const p = project(r.lat, r.lng);
            const active = selected?.id === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                title={r.name}
                style={{
                  position: "absolute",
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: `translate(-50%,-100%) scale(${active ? 1.25 : 1})`,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "transform 0.15s ease",
                  zIndex: active ? 10 : 1,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50% 50% 50% 0",
                    background: CATEGORY_COLORS[r.category],
                    transform: "rotate(-45deg)",
                    boxShadow: active ? "0 4px 10px rgba(0,0,0,0.3)" : "0 2px 5px rgba(0,0,0,0.2)",
                    border: "2px solid #FFFDF8",
                  }}
                />
              </button>
            );
          })}

          {selected && (
            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                right: 16,
                background: "#FFFFFF",
                borderRadius: 14,
                padding: "16px 18px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: "#3A342C" }}>
                  {selected.name}
                </div>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 10.5,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: CATEGORY_COLORS[selected.category],
                    fontWeight: 600,
                  }}
                >
                  {selected.category}
                </span>
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6B6255", marginTop: 6 }}>
                {selected.desc}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 10, fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#8A8070" }}>
                <span>{selected.time}</span>
                <span>{selected.address}</span>
              </div>
            </div>
          )}
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 460, overflowY: "auto", paddingRight: 4 }}>
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              style={{
                textAlign: "left",
                background: selected?.id === r.id ? "#FFFFFF" : "#FBF8F1",
                border: selected?.id === r.id ? "1px solid #D9C9A0" : "1px solid #F0EAE0",
                borderRadius: 14,
                padding: "14px 16px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: CATEGORY_COLORS[r.category],
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, color: "#3A342C" }}>
                    {r.name}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#8A8070", marginTop: 2 }}>
                    {r.desc}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#B0A891", marginTop: 4 }}>
                    {r.time} · {r.address}
                  </div>
                </div>
              </div>
              <ChevronRight size={16} color="#D9C9A0" style={{ flexShrink: 0 }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */

export default function ParisTravelGuide() {
  const [page, setPage] = useState("Home");

  return (
    <div
      style={{
        background: "#FAF7F0",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
      `}</style>
      <NavBar page={page} setPage={setPage} />
      {page === "Home" && <HomePage setPage={setPage} />}
      {page === "Travel Details" && <TravelDetailsPage />}
      {page === "Trip Itinerary" && <ItineraryPage />}
      {page === "Other Ideas" && <OtherIdeasPage />}
    </div>
  );
}
