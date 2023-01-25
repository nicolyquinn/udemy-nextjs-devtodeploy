import React from "react";
import Layout from "@/components/Layout";
import { API_URL, PER_PAGE } from "@/config/index";
import EventItem from "@/components/EventItem";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import Pagination from "@/components/Pagination";

const EventsPage = ({ events, total, page }) => {
  return (
    <Layout className={styles.container}>
      <h1>Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}

      {events.map((evt) => (
        <EventItem key={evt.id} evt={evt} />
      ))}

      <Pagination page={page} total={total} />
    </Layout>
  );
};

export async function getServerSideProps({ query: { page = 1 } }) {
  // // Calculate start page
  const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE;

  // Fetch total/count
  const totalRes = await fetch(
    `${API_URL}/api/events?pagination[withCount]=true`
  );
  const totalData = await totalRes.json();
  const total = totalData.meta.pagination.total;

  // Fetch events
  const eventRes = await fetch(
    `${API_URL}/api/events?populate=*&sort=date:asc&pagination[page]=${page}&pagination[pageSize]=${PER_PAGE}`
  );
  const events = await eventRes.json();

  return {
    props: { events: events.data, page: +page, total },
  };
}

export default EventsPage;
