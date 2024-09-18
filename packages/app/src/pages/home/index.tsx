import list from "@etf/data";
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col gap-y-1">
      {list.map((item) => (
        <Link key={item.code} to={`/${item.code}`}>
          {item.name}-{item.index}
        </Link>
      ))}
    </div>
  );
};

export default Home;
