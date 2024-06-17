import { useRequest } from "ahooks";
import { getEtfList } from "@etf/api";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { data, loading } = useRequest(() => getEtfList());

  if (loading) {
    return <Spin />;
  }

  return (
    <div className="grid grid-cols-5 gap-2 p-4 box-border text-foreground">
      {data?.map((item) => {
        return (
          <div
            key={item.code}
            className="bg-slate-auto-200"
            onClick={() => {
              navigate(`/${item.code}`);
            }}
          >
            <p>
              {item.name}-{item.code}
            </p>
            <p>
              {item.index}-{item.gm}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
