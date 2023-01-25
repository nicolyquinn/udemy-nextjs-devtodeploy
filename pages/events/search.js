import React from "react";
import qs from "qs";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import EventItem from "@/components/EventItem";
import styles from "@/styles/Home.module.css";

const SearchPage = ({ events }) => {
  const router = useRouter();
  return (
    <Layout title="Search Results" className={styles.container}>
      <Link href="/events">Go back</Link>
      <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
        <h1>Search Results for</h1>
        <h1 style={{ color: "red" }}>{router.query.term}</h1>
      </div>
      {events.length === 0 && <h3>No events to show</h3>}

      {events.map((evt) => (
        <EventItem key={evt.id} evt={evt} />
      ))}
    </Layout>
  );
};

export async function getServerSideProps({ query: { term } }) {
  const query = qs.stringify(
    {
      filters: {
        $or: [
          {
            name: {
              $containsi: term,
            },
          },
          {
            performers: {
              $containsi: term,
            },
          },
          {
            description: {
              $containsi: term,
            },
          },
          {
            venue: {
              $containsi: term,
            },
          },
        ],
      },
    },
    {
      encode: false,
    }
  );

  const res = await fetch(`${API_URL}/api/events?${query}&populate=*`);
  const events = await res.json();

  return {
    props: { events: events.data },
  };
}

export default SearchPage;
